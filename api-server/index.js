const express = require('express')
const {generateSlug} = require('random-word-slugs')
const {ECSClient, RunTaskCommand, ECS} = require('@aws-sdk/client-ecs')
const {Server} = require('socket.io')
const {z, string} = require('zod')
const {PrismaClient} = require('@prisma/client')
const {v4: uuidv4} = require('uuid')
const {createClient} = require('@clickhouse/client')


const app = express()
const PORT = 9000 
const prisma = new PrismaClient({}) 
const io = new Server({cors: "*"})

const kafka = new Kafka({
    clientId: `docker-build-server-${PROJECT_ID}`, 
    brokers: ['insert-broker-url'], 
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')]
    }, 
    sasl: {
        username: 'admin', 
        password: 'insert-password', 
        mechanism: 'plain'
    }
})


const client = createClient({
    host: `provide-host-link-with-https`,
    database: 'default',
    username: 'putname',
    password: 'putpass'
})

const consumer = kafka.consumer({groupId: 'api-server-logs-consumer'})


io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

const ecsClient = ECSClient({
    credentials: {
        accessKeyId: '', 
        secretAccessKey: ''
    }
})

const config = {
    CLUSTER: 'enter-cluster-url',
    TASK: 'task-link'
}

app.use(express.json())
app.use(cors())

app.post('/project', async (req, res) => {
    const schema = z.object({
        name: z.string(), 
        gitUrl: z.string() 
    })
    const safeParseResult = schema.safeParse(req.body)
    if (safeParseResult.error) return res.status(400).json({error: safeParseResult.error})
    
    const {name, gitUrl}  = safeParseResult.data 
    const deployment = await prisma.project.create({
        data: {
            name,
            gitUrl, 
            subDomain : generateSlug()
        }
    })

    return res.json({status: 'success', data: {project}})
})


app.post('/deploy', async (req, res) => {

    const {projectId} = req.body 
    const project = await prisma.project.findUnique({where: {id: projectId}})

    if (!project) return res.status(404).json({error: 'Project Not Found'})

    // Check if there is no running deployment 

    const deployment = await prisma.deployment.create({
        data: {
            project: {connect: {id: projectId}},
            status: 'QUEUE'
        }
    })

    //Spin the container here : 
    const command = new RunTaskCommand({
        cluster: config.CLUSTER, 
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                subnets: [''], //enter subnets from ecs here. 
                securityGroups: [''] //again, self explaintory
            }
        }, 
        overrides: {
            //you mention env variables 
            containerOverrides: [
                {
                    name: "builder-image", 
                    environment: [
                        {name: 'GIT_REPOSITORY__URL', value: project.gitUrl}, 
                        {name: 'PROJECT_ID', value: projectId},
                        {name: 'DEPLOYMENT_ID', value: deployment.id}
                    ]
                }
            ]                         
        }
    })

    await ecsClient.send(command); 
    return res.json({status: 'queued', data: {projectSlug, url: `http://${projectSlug}.local:8000`}})
})

app.get('/logs:id', async (req, res) => {
    const id = req.params.id; 
    const logs = await client.query({
        query: `SELECT event_id, deployement_id, log, timestamp from log_events where deployment_id = {deployment_id:String}; `,
        query_params: {
            deployment_id: id, 
        },
        format: "JSONEachRow"
    })

    const rawLogs = await logs.json()
    return res.json({logs: rawLogs})
})


async function initkafkaConsumer() {
    await consumer.connect() 
    await consumer.subscribe({topics: ['container-logs']})

    await consumer.run({
        autoCommit: false, 
        eachBatch: async function ({batch, heartbeat, commitOffsetsifNecessary, resolveOffsets}) {
            const messages = batch.messages; 
            console.log(`Recieved ${messages.length} messages..`)
            for (const message of messages) {
                //insert message to clickhouse 
                const stringMessage = message.value.toString()
                const {PROJECT_ID, DEPLOYMENT_ID, log} = JSON.parse(stringMessage)
                const {query_id} = await client.insert({
                    table: 'log-events',
                    values: [{event_id: uuidv4(), 
                        deployment_id: DEPLOYMENT_ID,
                        log
                    }], 
                    format: 'JSONEachRow'
                })

                resolveOffsets(message.offset)
                await commitOffsetsifNecessary(message.offset)
                await heartbeat()

            }
        }
    })
}

initkafkaConsumer()

app.listen(PORT, () => console.log(`API Server Running...${PORT}`))
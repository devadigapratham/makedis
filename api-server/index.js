const express = require('express')
const {generateSlug} = require('random-word-slugs')
const {ECSClient, RunTaskCommand, ECS} = require('@aws-sdk/client-ecs')
const {Server} = require('socket.io')
const Redis = require('ioredis')

const app = express()
const PORT = 9000 

const subscriber = new Redis()

const io = new Server({cors: "*"})
io.listen(9001, () => console.log('Socker Server : 9001'))

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
app.post('/project', async (req, res) => {
    const {gitUrl} = req.body 
    const projectSlug = generateSlug()

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
                        {name: 'GIT_REPOSITORY__URL', value: gitUrl}, 
                        {name: 'PROJECT_ID', value: projectSlug}
                    ]
                }
            ]                         
        }
    })

    await ecsClient.send(command); 
    return res.json({status: 'queued', data: {projectSlug, url: `http://${projectSlug}.local:8000`}})
})

async function initRedisSubscribe() {
    console.log('Subscribed to logs...')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}

initRedisSubscribe() 

app.listen(PORT, () => console.log(`API Server Running...${PORT}`))
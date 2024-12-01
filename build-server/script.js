const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const Redis = require('ioredis')

const publisher = new Redis("link") //insert redis link 

const s3Client = new S3Client ({
    region: '',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})

const PROJECT_ID = process.env.PROJECT_ID

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({log}))  
}


async function init() {
    console.log('Executing script.js')
    publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output') 

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data){
        console.log(data.toString())
        publishLog(data.toString())
    })

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
        publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function() {
        console.log('Build Complete')
        publishLog('Build Complete')
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive: true})

        publishLog('Starting to Upload...')

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstat.Sync(filePath).isDirectory()) continue; 

            console.log('uploading', filePath)
            publishLog(`uploading: ${file}`)

            const command = new PutObjectCommand({
                Bucket: '',
                Key: `__outputs/${PROJECT_ID}/${filePath}`, 
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            console.log('uploaded', filePath)
            publishLog(`Uploaded: ${file}`)
        }
        publishLog(`Done!`)
        console.log('Done!')
    })
}
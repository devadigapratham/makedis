const express = require('express')
const httpProxy = require('http-proxy')
const app = express()
const PORT = 8000 

const BASE_PATH = "link/_outputs" // Insert S3 bucket link
const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname; 
    const subdomain = hostname.split('.')[0]; 
    //can add in Custom Domain using DB Query *feature request* 

    const resolvesTo = `${BASE_PATH}/${subdomain}` // Insert here 
    //reverse proxy 
    return proxy.web(req, res, {target: resolvesTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url; 
    if (url == '/')
        proxyReq.path += 'index.html' 
})

app.listen(POST, () => console.log(`Reverse Proxy Running...${PORT}`))

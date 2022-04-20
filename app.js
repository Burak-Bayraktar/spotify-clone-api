const express = require('express')
const app = express();
const http = require('http')

const server = http.createServer(app);
const cors = require('cors')

app.use(cors())

app.get('/', async(req, res) => {
    res.send('Hello from Spotify Web API starting point')
})

server.listen(8000, () => {
    console.log('working')
})
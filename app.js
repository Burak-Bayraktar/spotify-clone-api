const express = require('express')
const app = express();
const http = require('http')
const server = http.createServer(app);
const cors = require('cors')
const qs = require('qs')
const { default: axios } = require('axios');
const axiosInstance = require('./axiosInstance');

app.use(cors())
require('dotenv').config()

app.get('/accessToken', async (req,res) => {
    const headers = {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
        const result = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            'grant_type': 'authorization_code',
            'code': req.query.code,
            'redirect_uri': process.env.REDIRECT_URL,
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET
        }), headers)

        res.status(200)
        res.json({
            'access-token': result.data['access_token'],
            'refresh-token': result.data['refresh_token']
        })
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/refreshToken', async (req,res) => {
    const refreshToken = req.query['refresh_token']
    
    const headers = {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
        const result = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET
        }), headers);

        res.status(200)
        res.json({
            'access-token': result.data['access_token'],
        })
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/getCurrentUser', async (req, res) => {
    try {
        const result = await axiosInstance.get('/me', { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }})
        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/current-user-playlists', async (req, res) => {
    try {
        const result = await axiosInstance.get('/me/playlists', { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }})
        
        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/current-user-albums', async (req, res) => {
    try {
        const result = await axiosInstance.get('/me/albums', { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }})

        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/new-releases', async (req, res) => {
    try {
        const result = await axiosInstance.get('/browse/new-releases', { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }});

        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/search', async (req, res) => {
    try {
        const result = await axiosInstance.get('/search', { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }, params: {
            ...req.query,
            type: req.query.type === 'all' ? 'album,artist,playlist,track,show,episode,audiobook' : req.query.type
        }})

        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.status(error.response.status)
        res.json(error)
    }
})

app.get('/user-top/:type', async (req, res) => {
    try {
        const result = await axiosInstance.get(`/me/top/${req.params.type}`, { headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        }})
        res.status(200)
        res.json(result.data)
    } catch (error) {
        res.json(error)
    }
})

app.get('/user/following-artists', async (req, res) => {
    debugger
    try {
        const result = await axiosInstance.get(`/me/following?type=artist`, {
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            }
        })
        debugger;
        console.log('RESULT', result.data)
        res.status(200);
        res.json(result.data);
    } catch (error) {
        console.log('ERROR', error)
        res.json(error);
    }
})

server.listen(process.env.PORT || 5000, () => {
    console.log('working')
})
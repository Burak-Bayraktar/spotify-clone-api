const { default: axios } = require("axios");
require('dotenv').config()

const axiosInstance = axios.create({
  baseURL: process.env.SPOTIFY_API_URL
})

module.exports = axiosInstance;
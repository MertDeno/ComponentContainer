const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
require('dotenv').config()

const fetchWeather = async (searchCity) => {
    const url = `https://api.weatherstack.com/current?access_key=${process.env.showTemperatureAPIKey}&query=${searchCity}`
    console.log(searchCity);
    console.log(searchCity);
    console.log(searchCity);
    try {
        const weatherStream = await fetch(url)
        const weatherJson = await weatherStream.json()
        return weatherJson
    } catch (error) {
        return {
            Error: error.stack
        }
    }
}

router.get("/", (req, res) => res.json({
    success: "Hello"
}))

router.get("/:searchCity", async(req, res) => {
    const searchTxt = req.params.searchCity
    const data = await fetchWeather(searchTxt)
    res.json(data)
})

module.exports = router

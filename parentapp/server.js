const express = require('express')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const cors = require('cors');
const axios = require('axios');

dotenv.config()

const app = express()
const port = 8080

app.use(cors())

app.get("/getCityData", async(req, res) => {
    debugger
    const city = req.query.city
    const cityAPIKey = process.env.city_API_key
    const url = `https://api.api-ninjas.com/v1/city?name=${city}`
    console.log(city+" 3 32")

    const response = await axios({
        method:"GET",
        url: url,
        host : 'localhost',    
        params: {
            $format: "json"
        },
        headers:{
            "X-Api-Key": cityAPIKey,
            'Content-Type':'application/json',
            'Accept':'application/json',
            "x-csrf-token" : "Fetch",
            "Access-Control-Allow-Origin": true
        },        
    })

    console.log(response.data)
    res.send(response.data)
    //res.send(data)
})

app.get("/getTemperature", async(req, res) => {
    debugger
    const city = req.query.cityName
    const url = `https://api.weatherstack.com/current?access_key=${process.env.temperature_API_Key}&query=${city}`
    console.log(url+" 3 32")

    const response = await axios({
        method:"GET",
        url: url,
        host : 'localhost',    
        params: {
            $format: "json"
        },
        headers:{
            "X-Api-Key": process.env.temperature_API_Key,
            'Content-Type':'application/json',
            'Accept':'application/json',
            "x-csrf-token" : "Fetch",
            "Access-Control-Allow-Origin": true
        },        
    })

    console.log(response.data)
    res.send(response.data)
    //res.send(data)
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
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
    const city = req.query.city
    const cityAPIKey = process.env.city_API_key
    const url = `https://api.api-ninjas.com/v1/city?name=${city}`

    if(city.length != 0){
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
    }
    else{
        res.send("")
    }

})

app.get("/getTemperature", async(req, res) => {
    const city = req.query.city
    const url = `https://api.weatherstack.com/current?access_key=${process.env.temperature_API_Key}&query=${city}`

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

    res.send(response.data)
})

app.get("/getForecasts", async(req, res) => {
    const city = req.query.city
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=8&key=${process.env.forecast_API_Key}`

    const response = await axios({
        method: "GET",
        url: url,
        host: "localhost",
        params:{
            $format: "json"
        },
        headers:{
            "X-Api-Key": process.env.forecast_API_Key,
            'Content-Type':'application/json',
            'Accept':'application/json',
            "x-csrf-token" : "Fetch",
            "Access-Control-Allow-Origin": true            
        }
    })

    res.send(response.data)
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const weather = require("./weatherstack")

app.use(express.json())

app.use(cors({
  origin: 'https://port8081-workspaces-ws-jxj7k.us10.trial.applicationstudio.cloud.sap'
}))

app.get("/", (req, res) => res.json({
  success: "Hello"
}))

app.use("/weather", weather)

app.listen(port, () => console.log(`Listening on port ${port}`))
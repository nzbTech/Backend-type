require('dotenv').config()
const morgan = require('morgan')
const express = require("express")
const bodyParser = require("body-parser")
const api = require("./api")
const app = express()


/* connection mongoDB */
const mongoose = require("mongoose")
try {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log("Connexion à MongoDB réussie !")
} catch (error) {
  console.error("Connexion à MongoDB échouée :", error)
}

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*')
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS")
    next()
})

app.use(bodyParser.json())
app.use(morgan(':method :url :status :response-time ms :date :referrer'))
app.use("/api", api)


module.exports = app

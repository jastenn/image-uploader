const https = require("https")
const fs = require("fs")

const express = require("express")
const multer = require("multer")

require("dotenv").config({
  path: "./config/.env",
})

const dbConnect = require("./config/dbConnect")

const connection = dbConnect()

const upload = multer()

const app = express()

const PORT = process.env.PORT || 3000

app.post("/upload", (req, res) => {
  res.send("/upload works")
})

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
      passphrase: process.env.PASS_PHRASE,
    },
    app
  )
  .listen(
    3000,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
  )

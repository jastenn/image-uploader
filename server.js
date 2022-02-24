const https = require("https")
const fs = require("fs")

const express = require("express")
const multer = require("multer")
const dotenv = require("dotenv")

dotenv.config({
  path: "./config/.env",
})

const upload = multer()

const app = express()

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
  .listen(3000)

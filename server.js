const https = require("https")
const fs = require("fs")
const path = require("path")

const express = require("express")
const multer = require("multer")
const bodyParser = require("body-parser")
const favicon = require("serve-favicon")

const Image = require("./model/image")

const asyncHandler = require("./util/asyncHandler")

require("dotenv").config({
  path: "./config/.env",
})

const dbConnect = require("./config/dbConnect")
const res = require("express/lib/response")

dbConnect()

const upload = multer({
  size: 16_000_000,
})

const app = express()

app.use(favicon(path.join(__dirname, "public", "images", "devchallenges.png")))

app.use(bodyParser.json())

app.use(express.static("public"))

app.set("view engine", "pug")

app.get(
  "/",
  asyncHandler((req, res) => {
    res.render("index", { title: "Image Uploader" })
  })
)

const PORT = process.env.PORT || 3000

// Routes
/**
 * TODO: Handle Invalid ID errors
 */
app.get("/photos/:id", async (req, res) => {
  const image = await Image.findById(req.params.id)

  res
    .setHeader("Content-Disposition", `filename=${image.original_name}`)
    .setHeader("Content-Type", "image/*")
    .send(image.buffer)
})

app.post(
  "/upload",
  upload.single("image"),

  asyncHandler(async (req, res) => {
    const image = await Image.create({
      ...req.file,
      original_name: req.file.originalname,
    })

    res.redirect(`/${image._id}`)
  })
)

app.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id)
    if (!image) return res.redirect("/")

    const encoded = image.buffer.toString("base64")

    res.render("result", {
      image: {
        source: `data:${image.mimetype};base64,${encoded}`,
      },
      link: `${process.env.BASE_URL}/photos/${req.params.id}`,
    })
  })
)

app.use((err, req, res, next) => {
  res.status(500).send("Server error")
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

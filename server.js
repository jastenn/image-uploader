const https = require("https")
const fs = require("fs")
const path = require("path")

const express = require("express")
const multer = require("multer")
const bodyParser = require("body-parser")
const favicon = require("serve-favicon")

const Image = require("./model/image")

const asyncHandler = require("./util/async-handler")
const HttpError = require("./util/http-error")

require("dotenv").config({
  path: "./config/.env",
})

const PORT = process.env.PORT || 3000

const dbConnect = require("./config/dbConnect")

dbConnect()

const upload = multer({
  size: 16_000_000,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] !== "image") {
      return cb(null, false)
    }
    cb(null, true)
  },
})

const app = express()

app.use(favicon(path.join(__dirname, "public", "images", "devchallenges.png")))

app.use(bodyParser.json())

app.use(express.static("public"))

app.set("view engine", "pug")

app.get("/", (req, res) => {
  const renderData = { title: "Image Uploader" }

  if (req.query.error === "invalid-id" && req.query.id) {
    renderData.error = `Id ${req.query.id} is not valid`
  }
  res.render("index", renderData)
})

app.get(
  "/photos/:id",
  asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id)

    res
      .setHeader("Content-Disposition", `filename=${image.original_name}`)
      .setHeader("Content-Type", "image/*")
      .send(image.buffer)
  })
)

app.post(
  "/upload",
  upload.single("image"),
  asyncHandler(async (req, res, next) => {
    if (!req.file) next(new HttpError("Image is undefined", 400))

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

app.use((err, req, res) => {
  console.log(err)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).redirect(`/?error=invalid-id&id=${err.value}`)
  }

  res.status(500).send("Server error")
})

// https
//   .createServer(
//     {
//       key: fs.readFileSync("key.pem"),
//       cert: fs.readFileSync("cert.pem"),
//       passphrase: process.env.PASS_PHRASE,
//     },
//     app
//   )
//   .listen(PORT)
app.listen(
  PORT,
  console.log(`Server Running on port ${PORT} in ${process.env.NODE_ENV}`)
)

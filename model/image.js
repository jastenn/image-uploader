const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
  original_name: String,
  mimetype: String,
  size: Number,
  buffer: Buffer,
})

module.exports = mongoose.model("Image", imageSchema)

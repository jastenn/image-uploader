const mongoose = require("mongoose")

module.exports = async function dbConnect() {
  const mongoUri = process.env.MONGO_URI

  try {
    const connection = await mongoose.connect(mongoUri)
    console.log(`Server connected on ${connection.connection.host} database`)
    return connection
  } catch (err) {
    console.error(err.message)
    process.exit()
  }
}

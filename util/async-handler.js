const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(400).redirect(`/?error=invalid-id&id=${err.value}`)
    }

    res.status(500).send("Server error")
  })

module.exports = asyncHandler

const router = require("express").Router()
const apiV1 = require("./v1")

router.use("/api/v1", apiV1)

module.exports = router
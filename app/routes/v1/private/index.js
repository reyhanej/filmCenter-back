const router = require("express").Router()
const ProfileRoutes = require("./Profile.route")

router.use("/profile", ProfileRoutes)

module.exports = router
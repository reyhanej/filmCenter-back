const router = require("express").Router()
const ProfileController = require("app/controllers/Profile.controller")

router.get("/info", ProfileController.getInfo)

router.post("/info", ProfileController.setInfo)

module.exports = router
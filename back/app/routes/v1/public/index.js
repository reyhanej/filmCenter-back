const router = require("express").Router()
const AuthRoutes = require("./Auth.route")

router.get("/", async(req, res, next) => {
    res.send("Hello from express")
})
router.use("/auth", AuthRoutes)

module.exports = router
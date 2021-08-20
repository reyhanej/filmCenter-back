const router = require("express").Router()
const { verifyAccessToken } = require("app/JWT")

const privateRoutes = require("./private")
const publicRoutes = require("./public")

router.use("/private", verifyAccessToken, privateRoutes)
router.use("/public", publicRoutes)


router.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status)
    const errorData = {
        data: {
            error: err.message
        },
        status
    }
    res.send({
        ...errorData
    })
})
router.use(async(req, res, next) => {
    next.createError.NotFound("this route does nor exist")
})

module.exports = router
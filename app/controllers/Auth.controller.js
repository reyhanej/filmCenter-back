const controller = require("./Controller")
const createError = require("http-errors")
const User = require("../models/user.model")
const { authSchema } = require("../app/helpers/validation_schema")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../app/helpers/jwt_helper")
const redisClient = require("../app/helpers/init_redis")

class Auth extends controller {
    async register(req, res, next) {
        try {

            const result = await authSchema.validateAsync(req.body);
            const exist = await User.findOne({ email: result.email });

            if (exist)
                throw createError.Conflict(`${result.email} has already been register`);
            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
            res.send({ accessToken, refreshToken })
        } catch (err) {
            if (err.isJoi) err.status = 422
            next(err)
        }
    }
    async login(req, res, next) {
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });

            if (!user) throw createError.NotFound("User is not registered")

            const checkPass = await user.isValidPassword(result.password)
            if (!checkPass) throw createError.Unauthorized("Invalid Email or Password!")

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)
            res.send({ accessToken })
        } catch (err) {
            if (err.isJoi)
                return next(createError.BadRequest("Invalid Email or Password!"))
            next(err)
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)

            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({ accessToken, refreshToken: refToken })
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            redisClient.DEL(userId, (err, val) => {
                if (err) {
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204)
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new Auth()
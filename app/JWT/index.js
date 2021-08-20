const jwt = require("jsonwebtoken")
const createError = require("http-errors")
const redisClient = require("../helpers/init_redis")
module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = config.accessTokenSecret
            const options = {
                expiresIn: "30m",
                issuer: "google.com",
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const token = req.headers['authorization']
        jwt.verify(token, config.accessTokenSecret, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }

            req.payload = payload
            next()
        })

    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = config.refreshTokenSecret
            const options = {
                expiresIn: "180d",
                issuer: "google.com",
                audience: userId
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                client.SET(userId, token, 'EX', 365 * 24 * 3600, (err, reply) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token)


                })
            })
        })
    },
    verifyRefreshToken: (ferfreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, config.refreshTokenSecret, (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud
                client.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    if (refreshToken === result) return resolve(userId)
                    reject(createError.Unauthorized())
                })

            })

        })
    }
}
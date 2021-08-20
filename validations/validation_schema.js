const joi = require("@hapi/joi")
const authSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(5).required(),
    fullName: joi.string().min(5).required()
})
const profileInfoSchema = joi.object({
    username: joi.string().min(4),
    fullname: joi.string().min(4)
})
module.exports = { authSchema }
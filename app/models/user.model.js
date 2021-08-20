const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        uniqe: true
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        uniqe: true,
    },
    fullName: {
        type: String,
        required: true
    }

})
UserSchema.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(this.password, salt)
        this.password = hashedPass
        next()
    } catch (e) {
        next(e)
    }
})
UserSchema.methods.isValidPassword = async function(paasword) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

const User = mongoose.model("user", UserSchema)
module.exports = User
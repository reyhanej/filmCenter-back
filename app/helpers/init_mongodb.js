const { config } = require("dotenv")
const mongoose = require("mongoose")
const { url, name } = config.databases.mongo

module.exports = {
    mongoConnection: function() {
        mongoose.Promise = global.Promise
        mongoose
            .connect(url + name, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
            .then(() => console.log("connected to mongodb"))
            .catch((err) => console.log("db connection err msg : ", err.message))
        mongoose.connection.on("connected", () => {
            console.log("Mongoose is connected to db")
        })

        mongoose.connection.on("error", (err) => {
            console.log("db connection err msg : ", err.message)
        })
        mongoose.connection.on("disconnected", () => {
            console.log("mongoose connection is disconnected")
        })


        process.on("SIGINT", async() => {
            await mongoose.connection.close()
            process.exit(0)
        })
    }
}
module.exports = {
    mongo: {
        url: process.env.MONGODB_URI,
        name: process.env.DB_NAME
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
}
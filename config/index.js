const databases = require("./databases")
module.exports = {
    databases,
    port: process.env.PORT,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    useCorsOption: process.env.USE_CORS_OPTIONS,
    devMode: process.env.DEV_MODE,
    siteURL: process.env.WEBSITE_URL,
    offline: false
}
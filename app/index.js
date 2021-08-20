const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const port = config.port || 3000;
const { mongoConnection } = require("app/helpers/init_mongodb");

module.exports = class Application {
    constructor() {
        this.runExpressAndMongo();
        this.setConfigs();
        this.setRoutes();
    }
    runExpressAndMongo() {
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
        mongoConnection();
    }
    setConfigs() {
        const limiter = new rateLimit({
            windowMs: 60 * 1000 * 15,
            max: 150,
            handler: (req, res) => {
                return res.json({
                    data: "تعداد درخواست های شما بیشتر از حد بوده لطفا بعدا تلاش کنید",
                    status: "error",
                });
            },
        });
        app.use(limiter);
        const whiteList = ["http://localhost:3001"];
        if (config.useCorsOption !== "false") {
            console.log("log", config.useCorsOption, typeof config.useCorsOption)
            const corsOptions = {
                origin: function(origin, callback) {
                    if (whiteList.indexOf(origin) !== -1) {

                        callback(null, true);
                        return;
                    }
                    callback(new Error("not allowed by CORS"));
                },
            };
            app.use(cors(corsOptions));
        } else {
            app.use(cors());
        }
        app.use(helmet());
        if (config.devMode) {
            app.use(morgan("dev"));
        }
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
    }
    setRoutes() {
        app.use(require("app/routes"));
    }
};
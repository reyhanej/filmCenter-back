const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const redisClient = require("app/helpers/init_redis");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = config.accessTokenSecret;

    const options = {
      expiresIn: "15m",
      issuer: "knowlage.ir",
      audience: userId,
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);

        return reject(createError.InternalServerError("error on create token"));
      }

      resolve(token);
    });
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = config.refreshTokenSecret;

    const options = {
      expiresIn: "120 days",
      issuer: "knowlage.ir",
      audience: userId,
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);

        return reject(createError.InternalServerError("error on create token"));
      }

      const oneYearSec = 365 * 24 * 60 * 60;

      redisClient.SET(userId, token, "EX", oneYearSec, (err, reply) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
      });

      resolve(token);
    });
  });
};

const verifyAccessToken = async function (req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeder = req.headers["authorization"];

  const bearerToken = authHeder.split(" ");

  const token = bearerToken[1];

  JWT.verify(token, config.accessTokenSecret, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }

    req.payload = payload;
    next();
  });
};

const verifyRefreshToken = function (refreshToken) {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, config.refreshTokenSecret, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(createError.Unauthorized(message));
      }

      const userId = payload.aud;

      redisClient.GET(userId, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError);
        }

        if (refreshToken === result) resolve(userId);

        reject(createError.Unauthorized());
      });
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

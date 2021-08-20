const controller = require("./Controller");
const createError = require("http-errors");
const User = require("app/models/User.model");

class Profile extends controller {
  async getInfo(req, res, next) {
    try {
      if (!req.payload || !req.payload.aud)
        throw createError.InternalServerError("bad token");
      const userId = req.payload.aud;
      const user = await User.findById(userId);
      if (!user) throw createError.NotFound("user was not found");

      res.send({
        email: user.email,
      });
    } catch (e) {
      next(e);
    }
  }

  async setInfo(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new Profile();

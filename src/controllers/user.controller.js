"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");
class UserController {
  loadUser = async (req, res, next) => {
    console.log('user',req.user);
    new SuccessResponse({
      message: "Load User success",
      metadata: await UserService.loadUser({
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new UserController();

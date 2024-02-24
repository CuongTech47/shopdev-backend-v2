"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    console.log("data_request:::", req.body);
    /* 
    201 CREATED
     */

    const { avatar } = req.body;

    if (avatar == "undefined" || avatar === "") {
      throw new BadRequestError("File not found");
    }

    new CREATED({
      message: "Vui lòng kiểm tra email để kích hoạt tài khoản",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  activation = async (req, res, next) => {
    /* 
    200 ok
     */
    new SuccessResponse({
      message: "Xác thực mở người dùng thành công",
      metadata: await AccessService.activationUser(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();

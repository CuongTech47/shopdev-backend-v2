"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
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

  login = async (req, res, next) => {
    /* 
    200 ok
     */
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide the all fields!");
    }
    new SuccessResponse({
      metadata: await AccessService.loginUser(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success!",
      metadata: await AccessService.logoutShop(req.keyStore,req.shop.shopId),
    }).send(res);
  };
  signUpShop = async (req, res, next) => {
    console.log("data shop", req.body);
    const { avatar } = req.body;

    if (avatar == "undefined" || avatar === "") {
      throw new BadRequestError("File not found");
    }
    new CREATED({
      message:
        "Vui lòng kiểm tra email để kích hoạt taì khoản bán hàng tại Shop Dev",
      metadata: await AccessService.signUpShop(req.body),
    }).send(res);
  };
  activationShop = async (req, res, next) => {
    /* 
    200 ok
     */
    new SuccessResponse({
      message: "Xác thực cửa thành công thành công",
      metadata: await AccessService.activationShop(req.body),
    }).send(res);
  };

  loginShop = async (req, res, next) => {
    /* 
    200 ok
     */
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide the all fields!");
    }
    new SuccessResponse({
      metadata: await AccessService.loginShop(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();

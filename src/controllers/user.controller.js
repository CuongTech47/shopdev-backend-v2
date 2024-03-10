"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");
class UserController {
  loadUser = async (req, res, next) => {
    // console.log('user',req.user);
    new SuccessResponse({
      message: "Load User success",
      metadata: await UserService.loadUser({
        userId: req.user.userId,
      }),
    }).send(res);
  };

  // update user info
  updateUserInfo = async (req, res, next) => {
    console.log('user info test',req.body);
    new SuccessResponse({
      message: "Cập nhật thành công",
      metadata: await UserService.updateUserInfo(req.body),
    }).send(res);
  };
  // update user avatar
  updateUserAvatar = async (req, res, next) => {
    const { file } = req;

    if (!file) {
      throw new BadRequestError("File not found");
    }

    new SuccessResponse({
      message: "Cập nhật thành công",
      metadata: await UserService.updateUserAvatar(
        { ...req.user },
        { path: file.path }
      ),
    }).send(res);
  };

  updateUserAddresses = async ( req , res , next) => {
    
    new SuccessResponse({
      message: "Cập nhật thành công",
      metadata: await UserService.updateUserAddresses({...req.user},req.body)
    }).send(res)
  }


  deleteUserAddresses = async ( req , res , next) => {
    new SuccessResponse({
      message: "Cập nhật thành công",
      metadata: await UserService.deleteUserAddresses({...req.user}, {addressId : req.params.id})
    }).send(res)
  }

  updateUserPassword = async ( req , res , next) => {
    new SuccessResponse({
      message: "Cập nhật thành công",
      metadata: await UserService.updateUserPassword({...req.user},req.body)
    }).send(res)
  }
}

module.exports = new UserController();

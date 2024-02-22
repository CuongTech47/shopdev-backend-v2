"use strict";

const { CREATED , SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    /* 
    201 CREATED
     */
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File not found");
    }

    new CREATED({
      message : 'Registed OK!',
      metadata: await AccessService.signUp({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        file: req.file,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();

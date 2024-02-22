"use strict";

const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const RoleUser = {
  USER: "USER",
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password, file }) => {
    const existingUser = await userModel.findOne({ email }).lean();
    if (existingUser) {
      throw new BadRequestError("User already exists", 400);
    }
    const filename = file.filename;
    const fileUrl = path.join(filename);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      name: name,
      email: email,
      password: passwordHash,
      avatar: fileUrl,
      roles: [RoleUser.USER],
    };

    const newUser = await userModel.create(user);

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Shop already registered!");
      }
      // Tạo cặp token
      const payload = {
        userId: newUser._id,
        email,
      };

      const tokens = await createTokenPair(payload,publicKey,privateKey)
      console.log(`Created Token Success::`, tokens);

      return {
        user:newUser,
        tokens
      }

    }

    
  };
}
module.exports = AccessService;

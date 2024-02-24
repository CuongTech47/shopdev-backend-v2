"use strict";

const cloudinary = require("../configs/cloudinary.conf");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");

const {
  createTokenPair,
  createActivattionToken,
  verifyJWT,
} = require("../auth/authUtils");
const { sendMailActivattionUser } = require("./sendMail.service");
const KeyTokenService = require("./keyToken.service");
const RoleUser = {
  USER: "USER",
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password, avatar }) => {
    // console.log('file',file)
    const existingUser = await userModel.findOne({ email }).lean();
    if (existingUser) {
      throw new BadRequestError("User already exists", 400);
    }
    const myCloud = await cloudinary.uploader.upload(avatar, {
      // public_id:'thumb',
      folder: "avatars",
    });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      name: name,
      email: email,
      password: passwordHash,
      avatar: {
        public_id: myCloud.public_id,
        url: await cloudinary.url(myCloud.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      },
      roles: [RoleUser.USER],
    };

    const activationToken = await createActivattionToken(user);

    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    console.log("activationToken", activationToken);

    await sendMailActivattionUser(user, activationUrl);

    // const newUser = await userModel.create(user);

    // if (newUser) {
    //   const privateKey = crypto.randomBytes(64).toString("hex");
    //   const publicKey = crypto.randomBytes(64).toString("hex");
    //   // console.log({ privateKey, publicKey });

    //   const keyStore = await KeyTokenService.createKeyToken({
    //     userId: newUser._id,
    //     publicKey: publicKey,
    //     privateKey: privateKey,
    //   });

    //   if (!keyStore) {
    //     throw new BadRequestError("Shop already registered!");
    //   }
    //   // Tạo cặp token
    //   const payload = {
    //     userId: newUser._id,
    //     email,
    //   };

    //   const tokens = await createTokenPair(payload, publicKey, privateKey);
    //   // console.log(`Created Token Success::`, tokens);

    //   return {
    //     user: newUser,
    //     tokens,
    //   };
    // }
  };
  static activationUser = async ({ activationToken }) => {
    // try {
    const userData = await verifyJWT(
      activationToken,
      process.env.ACTIVATION_SECRET
    );
    // } catch (error) {
    //   throw new BadRequestError('Token Het Han!')
    // }

    console.log("userData", userData);

    if (!userData) {
      throw new BadRequestError("Invalid token");
    }
    const { email } = userData;
    const existingUser = await userModel.findOne({ email: email }).lean();
    if (existingUser) {
      throw new BadRequestError("User already exists", 400);
    }
    const newUser = await userModel.create(userData);

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
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
      const tokens = await createTokenPair(payload, publicKey, privateKey);
      return {
        user: newUser,
        tokens,
      };
    }
  };
}
module.exports = AccessService;

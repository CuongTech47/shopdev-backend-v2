"use strict";

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const userModel = require("../models/user.model");
const shopModel = require("../models/shop.model");
const {
  createTokenPair,
  createActivationToken,
  verifyJWT,
} = require("../auth/authUtils");
const {
  sendMailActivationUser,
  sendMailActivationShop,
} = require("./sendMail.service");
const KeyTokenService = require("./keyToken.service");
const shopKeyTokenService = require("./shopKeyToken.service");
const {
  cacheAvatarData,
  getAvatarDataFromRedis,
  saveUserLoginInfo,
} = require("./redis.service");
const { uploadImageFromLocal } = require("./upload.service");
const { getInfoData } = require("../utils");
const RedisService = require("./redis.service");
const RoleUser = {
  USER: "USER",
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
const RoleShop = {
  // USER: "USER",
  // SHOP: "SHOP",
  // WRITER: "WRITER",
  // EDITOR: "EDITOR",
  // ADMIN: "ADMIN",
  SELLER: "SELLER",
};
class AccessService {
  static signUp = async ({ name, email, password, avatar }) => {

      const existingUser = await userModel.findOne({ email }).lean();
      if (existingUser) {
        throw new BadRequestError("User already exists", 400);
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const user = {
        name: name,
        email: email,
        password: passwordHash,
      };
      await cacheAvatarData(email, avatar);

      const activationToken = await createActivationToken(user);

      const activationUrl = `http://localhost:5173/user/activation/${activationToken}`;

      await sendMailActivationUser(user, activationUrl);

  };

  // xac thuc nguoi dung
  static activationUser = async ({ activationToken }) => {
    const userData = await verifyJWT(
      activationToken,
      process.env.ACTIVATION_SECRET
    );

    if (!userData) {
      throw new BadRequestError("Invalid token");
    }

    const { email, name, password } = userData;

    const existingUser = await userModel.findOne({ email: email }).lean();
    if (existingUser) {
      throw new BadRequestError("User already exists", 400);
    }
    const avatarDataCache = await getAvatarDataFromRedis(email);

    const { public_id, url } = await uploadImageFromLocal(
      avatarDataCache.avatar,
      "avatars"
    );

    const user = {
      email: email,
      name: name,
      password: password,
      avatar: {
        public_id: public_id,
        url: url,
      },
      roles: [RoleUser.USER],
    };
    console.log("new user insert", user);
    const newUser = await userModel.create(user);

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

  // login user
  static loginUser = async ({ email, password, refreshToken = null }) => {
    const foundUser = await userModel.findOne({ email }, "+password").lean();
    console.log("userData", foundUser);

    if (!foundUser) throw new BadRequestError("User not resgisted!");
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication errors");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundUser;
    await saveUserLoginInfo(userId, foundUser);

    const payload = {
      userId,
      email,
    };
    const tokens = await createTokenPair(payload, publicKey, privateKey);
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      user: getInfoData({
        fileds: ["_id", "name", "email", "avatar"],
        obj: foundUser,
      }),
      tokens,
    };
  };

  // dang xuat shop
  static logoutShop = async (keyStore, shopId) => {
    const delKey = await shopKeyTokenService.removeKeyById(keyStore._id);
    const delKeyResdis = await RedisService.delKeyUserLogin(shopId);
    // console.log(delKey);
    return { delKey, delKeyResdis };
  };

  // dang ki shop
  static signUpShop = async ({
    name,
    email,
    password,
    avatar,
    address,
    phoneNumber,
    zipCode,
  }) => {
    const existingShopSeller = await shopModel.findOne({ email }).lean();
    if (existingShopSeller) {
      throw new BadRequestError("Người bán đã tồn tại !", 400);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const seller = {
      name,
      email,
      password: passwordHash,
      address: address,
      phoneNumber,
      zipCode,
    };
    await cacheAvatarData(email, avatar);
    const activationToken = await createActivationToken(seller);
    const activationUrl = `http://localhost:5173/shop/activation/${activationToken}`;
    await sendMailActivationShop(seller, activationUrl);
  };

  // xac thuc shop
  static activationShop = async ({ activationToken }) => {
    const sellerData = await verifyJWT(
      activationToken,
      process.env.ACTIVATION_SECRET
    );

    console.log(sellerData);

    if (!sellerData) {
      throw new BadRequestError("Invalid token");
    }

    const { name, email, password, address, phoneNumber, zipCode } = sellerData;

    const existingShopSeller = await shopModel.findOne({ email: email }).lean();
    if (existingShopSeller) {
      throw new BadRequestError("Shop already exists", 400);
    }
    const avatarDataCache = await getAvatarDataFromRedis(email);

    const { public_id, url } = await uploadImageFromLocal(
      avatarDataCache.avatar,
      "avatars-shop"
    );

    const seller = {
      email: email,
      name: name,
      password: password,
      avatar: {
        public_id: public_id,
        url: url,
      },
      roles: [RoleShop.SELLER],
      zipCode,
      phoneNumber,
      address,
    };
    console.log("new seller insert", seller);
    const newShop = await shopModel.create(seller);

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await shopKeyTokenService.createKeyToken({
        shopId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Shop already registered!");
      }
      // Tạo cặp token
      const payload = {
        shopId: newShop._id,
        email,
      };
      const tokens = await createTokenPair(payload, publicKey, privateKey);
      return {
        shop: newShop,
        tokens,
      };
    }
  };

  static loginShop = async ({ email, password, refreshToken = null }) => {
    const foundShop = await shopModel.findOne({ email }, "+password").lean();
    console.log("shopData", foundShop);

    if (!foundShop) throw new BadRequestError("Shop not resgisted!");
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication errors");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: shopId } = foundShop;
    await saveUserLoginInfo(shopId, foundShop);

    const payload = {
      shopId,
      email,
    };
    const tokens = await createTokenPair(payload, publicKey, privateKey);
    await shopKeyTokenService.createKeyToken({
      shopId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email", "avatar"],
        obj: foundShop,
      }),
      tokens,
    };
  };
}
module.exports = AccessService;

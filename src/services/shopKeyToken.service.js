"use strict";

const shopKeyTokenModel = require("../models/shopKeyToken.model");
const { Types } = require("mongoose");
class ShopKeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level xxx
      const filter = { shop: shopId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await shopKeyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (shopId) => {
    return await shopKeyTokenModel.findOne({
      shop: new Types.ObjectId(shopId),
    });
  };

  static removeKeyById = async (id) => {
    return await shopKeyTokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await shopKeyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await shopKeyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (shopId) => {
    return await shopKeyTokenModel.deleteOne({
      shop: new Types.ObjectId(shopId),
    });
  };
}
module.exports = ShopKeyTokenService;

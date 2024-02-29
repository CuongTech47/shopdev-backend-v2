"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "ShopKey";
const COLLECTION_NAME = "ShopKeys";

const shopKeyTokenSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Shop",
      // ref : 'Shop'
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [], // nhung rf da dc su dung
    },
    refreshToken: {
      type: String, // nhung rf dang dc su dung
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopKeyTokenSchema);
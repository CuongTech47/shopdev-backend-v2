"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Coupon";
const COLLECTION_NAME = "Coupons";

const couponSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupoun code name!"],
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  selectedProduct: {
    type: String,
  },
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, couponSchema)

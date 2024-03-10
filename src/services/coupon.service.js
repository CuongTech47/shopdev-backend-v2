"use strict";

const { BadRequestError } = require("../core/error.response");
const couponCodeModel = require("../models/couponCode.model");
const shopModel = require("../models/shop.model");
const { Types } = require("mongoose");
class CouponService {
  static createCouponCode = async (
    { shopId, email },
    { name, minAmount, maxAmount, selectedProducts, value }
  ) => {
    const shop = await shopModel.findOne({ email: email });
    if (!shop) {
      throw new BadRequestError("Shop is invalid!", 400);
    }
    const couponCodeExists = await couponCodeModel.findOne({ name: name });
    console.log(couponCodeExists);
    if (couponCodeExists) {
      throw new BadRequestError("Ma code da ton tai");
    }

    const couponData = {
      name,
      minAmount,
      maxAmount,
      selectedProduct : selectedProducts,
      value,
      shopId: new Types.ObjectId(shopId),
    };

    const coupon = await couponCodeModel.create(couponData)

    return {
      coupounCode:coupon
    }
  };
  static getCouponCodeShop = async({shopId}) => {
    const coupons = await couponCodeModel.find({shopId:shopId})
    return {
      couponCodes:coupons
    }
  }

  static getCouponValue = async(name) => {
    const coupon = await couponCodeModel.findOne({name:name})
    return {
      couponCode : coupon
    }
  }
}

module.exports = CouponService;

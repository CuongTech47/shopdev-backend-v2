"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CouponService = require("../services/coupon.service");

class CouponCodeController {
  createCouponCode = async (req, res, next) => {
    console.log(req.body);
    new CREATED({
      message: "Create Coupon Code success!",
      metadata: await CouponService.createCouponCode(req.shop, { ...req.body }),
    }).send(res);
  };

  getCouponCodeShop = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Coupon of Shop Success",
        metadata: await CouponService.getCouponCodeShop({
            shopId : req.params.id
        })
    }).send(res)
  };

    getCouponValue = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Coupon Value Success",
            metadata: await CouponService.getCouponValue(req.params.name)
        }).send(res)
    }
}

module.exports = new CouponCodeController();

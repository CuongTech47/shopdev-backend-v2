"use strict";

const express = require("express");

const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationForShop } = require("../../auth/authUtils");
const couponController = require("../../controllers/coupon.controller");

router.use(authenticationForShop);

router.post('/create-coupon-code',asyncHandler(couponController.createCouponCode))
router.get('/get-coupon/:id',asyncHandler(couponController.getCouponCodeShop))
module.exports = router;

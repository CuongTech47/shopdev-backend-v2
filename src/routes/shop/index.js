"use strict";

const shopController = require ("../../controllers/shop.controller");

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationForShop } = require("../../auth/authUtils");
router.get('/get-shop-info/:id',asyncHandler(shopController.getShopInfo))
router.use(authenticationForShop);
router.get('/load-shop',asyncHandler(shopController.loadShop))

module.exports = router
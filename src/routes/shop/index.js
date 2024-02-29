"use strict";

const shopController = require ("../../controllers/shop.controller");

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationForShop } = require("../../auth/authUtils");

router.use(authenticationForShop);
router.get('/load-shop',asyncHandler(shopController.loadShop))

module.exports = router
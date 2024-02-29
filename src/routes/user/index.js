"use strict";
const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");

// authentication
router.use(authenticationV2);
router.get('/load-user',asyncHandler(userController.loadUser))


module.exports = router;

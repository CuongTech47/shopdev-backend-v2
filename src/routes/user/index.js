"use strict";
const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");
const { uploadDisk } = require('../../configs/multer.conf')



// authentication
router.use(authenticationV2);
router.get('/load-user',asyncHandler(userController.loadUser))

// update user info
router.put('/update-user-info',asyncHandler(userController.updateUserInfo))

// update user avt
router.put('/update-user-avatar',uploadDisk.single('avatar'),asyncHandler(userController.updateUserAvatar))


module.exports = router;

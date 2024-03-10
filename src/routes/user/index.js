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


// update user addresses
router.put('/update-user-addresses',asyncHandler(userController.updateUserAddresses))

// delete user addresses
router.delete('/delete-user-address/:id',asyncHandler(userController.deleteUserAddresses))

// update user password
router.put('/update-user-password',asyncHandler(userController.updateUserPassword))

module.exports = router;

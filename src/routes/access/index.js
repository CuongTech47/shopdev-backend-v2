'use strict'

const express = require('express')
const  asyncHandler  = require('../../helpers/asyncHandler')
const { uploadDisk } = require('../../configs/multer.conf')
const accessController = require('../../controllers/access.controller')
const { authenticationV2,authenticationForShop } = require('../../auth/authUtils')
const router = express.Router()

// signUp
router.post('/user/signup',uploadDisk.single('avatar'),asyncHandler(accessController.signUp))
router.post('/user/activation',asyncHandler(accessController.activation))
// signUp shop
router.post('/shop/signup',uploadDisk.single('avatar'),asyncHandler(accessController.signUpShop))
router.post('/shop/activation',asyncHandler(accessController.activationShop))
// login
router.post('/user/login',asyncHandler(accessController.login))
router.post('/shop/login',asyncHandler(accessController.loginShop))
// authentication

router.post('/shop/logout',authenticationForShop,asyncHandler(accessController.logout))
module.exports = router
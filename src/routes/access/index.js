'use strict'

const express = require('express')
const  asyncHandler  = require('../../helpers/asyncHandler')
const { uploadDisk } = require('../../configs/multer.conf')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

// signUp 
router.post('/user/signup',uploadDisk.single('avatar'),asyncHandler(accessController.signUp))
router.post('/user/activation',asyncHandler(accessController.activation))

module.exports = router
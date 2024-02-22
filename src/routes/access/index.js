'use strict'

const express = require('express')
const  asyncHandler  = require('../../helpers/asyncHandler')
const { uploadDisk } = require('../../configs/multer.conf')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

// signUp 
router.post('/user/signup',uploadDisk.single("file"),asyncHandler(accessController.signUp))

module.exports = router
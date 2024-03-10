'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')

const router = express.Router()

// router.use(apiKey)

// router.use(permisstion('0000'))
router.use('/api/v1/order',require('./order'))
router.use('/api/v1/payment',require('./payment'))
router.use('/api/v1/coupon',require('./coupon'))
router.use('/api/v1/event',require('./event'))
router.use('/api/v1/product',require('./product'))
router.use('/api/v1/access',require('./access'))
router.use('/api/v1/user',require('./user'))
router.use('/api/v1/shop',require('./shop'))


module.exports = router
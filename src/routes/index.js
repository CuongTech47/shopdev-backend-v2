'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')

const router = express.Router()

// router.use(apiKey)

// router.use(permisstion('0000'))
router.use('/api/v1/product',require('./product'))
router.use('/api/v1/access',require('./access'))
router.use('/api/v1/user',require('./user'))
router.use('/api/v1/shop',require('./shop'))


module.exports = router
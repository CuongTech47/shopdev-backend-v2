'use strict'

const express = require('express')
const { apiKey, permisstion } = require('../auth/checkAuth')

const router = express.Router()

router.use(apiKey)

// router.use(permisstion('0000'))

router.use('/api/v1',require('./access'))




module.exports = router
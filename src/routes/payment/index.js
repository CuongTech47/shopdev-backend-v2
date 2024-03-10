const express = require('express')

const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const paymentController = require('../../controllers/payment.controller')
router.post('/process',asyncHandler(paymentController.process))
router.get('/stripeapikey',asyncHandler(paymentController.stripeapikey))

router.post('/create-payment-url',asyncHandler(paymentController.createPaymentUrl))

module.exports = router
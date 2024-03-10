'use strict'



const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/asyncHandler');
const orderController = require('../../controllers/order.controller');
const {authenticationV2 , authenticationForShop} = require('../../auth/authUtils')

router.get('/get-all-orders-of-shop/:shopId',authenticationForShop,asyncHandler(orderController.getAllOrdersOfShop))
router.put('/update-order-status/:id',authenticationForShop,asyncHandler(orderController.updateOrderStatusForShop))

router.use(authenticationV2);
router.post('/create-order',asyncHandler(orderController.createOrder))
router.get('/get-all-orders-of-user/:userId',asyncHandler(orderController.getAllOrdersOfUser))
module.exports = router;
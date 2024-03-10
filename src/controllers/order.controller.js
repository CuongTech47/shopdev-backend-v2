'use strict'


const {CREATED, SuccessResponse} = require("../core/success.response");
const OrderService = require("../services/order.service");
class OrderController {
    createOrder = async (req, res, next) => {
        console.log(req.body)
        new CREATED({
            message: "Order created",
            metadata: await OrderService.createOrder(req.body)
        }).send(res)
    }

    getAllOrdersOfUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Orders",
            metadata: await OrderService.getAllOrdersOfUser(req.params.userId)
        }).send(res)
    }

    getAllOrdersOfShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Orders",
            metadata: await OrderService.getAllOrdersOfShop(req.params.shopId)
        }).send(res)
    }

    updateOrderStatusForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Order status updated",
            metadata: await OrderService.updateOrderStatusForShop(req.params.id, {...req.body},{...req.shop})
        }).send(res)
    }
}


module.exports = new OrderController();
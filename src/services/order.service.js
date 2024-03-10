'use strict'

const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');
const shopModel = require('../models/shop.model');
const {NotFoundError} = require("../core/error.response");
class OrderService {
    static createOrder = async ({cart,shippingAddress,user,totalPrice,paymentInfo,feeShip,discountPrice}) => {
        const shopItemsMap = new Map();

        for (const item of cart) {
            const {shopId} = item;
            // shopItemsMap.set(product,quantity);
            if(!shopItemsMap.has(shopId)){
                shopItemsMap.set(shopId,[]);
            }
            shopItemsMap.get(shopId).push(item);
        }
        const orders = [];

        for (const [shopId, items] of shopItemsMap) {
            const order =  await orderModel.create({
                cart:items,
                shippingAddress,user,totalPrice,paymentInfo,feeShip,discountPrice
            });
            orders.push(order);
        }

        return {
            orders
        }
    }


// get all orders of user
    static getAllOrdersOfUser = async (userId) => {
        const orders = await orderModel.find({"user._id":userId}).sort({createdAt:-1});
        return {
            orders
        }
    }

    // get all orders of seller
    static getAllOrdersOfShop = async (shopId) => {
        const orders = await orderModel.find({"cart.shopId":shopId}).sort({createdAt:-1});
        return {
            orders
        }
    }

    // update order status for seller
    static updateOrderStatusForShop = async (orderId,{status},{shopId}) => {
        console.log(`orderId: ${orderId} status: ${status} shopId: ${shopId}`)
        const order = await orderModel.findById(orderId);

        if(!order){
            throw new NotFoundError(`Order id ${orderId} not found`,404);
        }
        if (status === "Transferred to delivery partner"){
            order.cart.forEach(async (o) => {
                await updateOrder(o._id, o.qty);
            });
        }

        order.status = status;

        if (status === "Delivered"){
            order.deliveredAt = Date.now();
            order.paymentInfo.status = "Succeeded";
            const serviceCharge = order.totalPrice * .10;
            await updateSellerInfo(order.totalPrice - serviceCharge);
        }
        await order.save({ validateBeforeSave: false });

        async function updateOrder(productId,qty) {
            const product = await productModel.findById(productId);
            product.stock -= qty;
            product.sold_out += qty;
            await product.save({ validateBeforeSave: false });
        }

        async function updateSellerInfo(amount) {
            const seller = await shopModel.findById(shopId);
            seller.availableBalance = amount;

            await seller.save();
        }
    }
}




module.exports = OrderService;
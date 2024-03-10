'use strict'


const {SuccessResponse} = require("../core/success.response");
const PaymentService = require("../services/payment.service");
class PaymentController {
  // async process(req, res , next) {
  //  new SuccessResponse({
  //    message: "Payment success",
  //    metadata: await PaymentService.processPayment({ ...req.body})
  //  }).send(res)
  // }
  //
  // async stripeapikey(req, res, next) {
  //   new SuccessResponse({
  //     message: "Stripe api key",
  //     metadata: await PaymentService.getStripeApiKey()
  //   }).send(res)
  // }

  async createPaymentUrl(req, res, next) {
    // console.log(req.body)
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    new SuccessResponse({
      message: "Payment url",
      metadata: await PaymentService.createPaymentUrl(ipAddr, { ...req.body})
    }).send(res)
  }
}


module.exports = new PaymentController();
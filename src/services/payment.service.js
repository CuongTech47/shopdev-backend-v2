'use strict'


const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
class PaymentService {
  // static processPayment = async ({amount}) => {
  //   console.log(amount);
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: amount,
  //     currency: "vnd",
  //     metadata: {
  //         company: "shopdev"
  //     }
  //   });
  //   return {
  //     clientSecret:paymentIntent.client_secret
  //   }
  // }
  // static getStripeApiKey = async () => {
  //   return {
  //     stripeApiKey:process.env.STRIPE_PUBLISHABLE_KEY
  //   }
  // }

  static createPaymentUrl = async(ipAddr,{amount,bankCode,orderDescription,orderType,language}) => {

      const tmnCode = process.env.VNP_TMN_CODE;
      const secretKey = process.env.VNP_HASH_SECRET;
      let vnpUrl = process.env.VNP_URL;
      const returnUrl = process.env.VNP_RETURN_URL;
      //
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      const orderId = moment(date).format('HHmmss');
      var currCode = 'VND';

      var vnp_Params = {
          vnp_Version: '2.1.0',
          vnp_Command: 'pay',
          vnp_TmnCode: tmnCode,
          vnp_Locale: language,
          vnp_CurrCode: currCode,
          vnp_TxnRef: orderId,
          vnp_OrderInfo: orderDescription,
          vnp_OrderType: orderType,
          vnp_Amount: amount * 100,
          vnp_ReturnUrl: returnUrl,
          vnp_IpAddr: ipAddr,
          vnp_CreateDate: createDate,
      };
      if(bankCode !== ''){
          vnp_Params['vnp_BankCode'] = bankCode;
      }
      var sortedParams = {};
      Object.keys(vnp_Params).sort().forEach(function(key) {
          sortedParams[key] = vnp_Params[key];
      });

      var signData = querystring.stringify(sortedParams, { encode: false });

      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      console.log('vnpUrl',vnpUrl);
  }
}




module.exports = PaymentService;
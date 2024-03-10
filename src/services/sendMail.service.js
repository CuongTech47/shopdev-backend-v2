"use strict";


const { receiveEmailFromQueue } = require("./consumerMail.service.js");
const { sendEmailToQueue } = require("./producerMail.service");


class MailService {
  static sendMailActivationUser = async (user, activationUrl) => {
    const { name, email } = user;

    const emailData = {
      email: email,
      subject: "Kích hoạt tài khoản của bạn",
      message: `Xin chào ${name}, vui lòng nhấp vào liên kết để kích hoạt tài khoản của bạn: ${activationUrl}`,
    };

    await sendEmailToQueue(emailData);
    await receiveEmailFromQueue();
  };
  static sendMailActivationShop = async (shop, activationUrl) => {
    const { name, email } = shop;

    const emailData = {
      email: email,
      subject: "Kích hoạt cửa hàng của bạn taị Shop-Dev",
      message: `Xin chào ${name}, vui lòng nhấp vào liên kết để kích hoạt cửa hàng của bạn : ${activationUrl}`,
    };

    await sendEmailToQueue(emailData);
    await receiveEmailFromQueue();
  };
}

module.exports = MailService;

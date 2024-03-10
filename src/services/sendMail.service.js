"use strict";

const sendMail = require("../configs/mailer.conf");
const { BadRequestError } = require("../core/error.response");
const consumerMailService = require("./consumerMail.service");
const { sendEmailToQueue } = require("./producerMail.service");
const { cacheEmailData } = require("./redis.service");
const { findByEmail } = require("./user.service");

class MailService {
  static sendMailActivationUser = async (user, activationUrl) => {
    const { name, email } = user;

    const emailData = {
      email: email,
      subject: "Kích hoạt tài khoản của bạn",
      message: `Xin chào ${name}, vui lòng nhấp vào liên kết để kích hoạt tài khoản của bạn: ${activationUrl}`,
    };

    await sendEmailToQueue(emailData);
    // await receiveEmailFromQueue();
    await consumerMailService.receiveEmailFromQueue();
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

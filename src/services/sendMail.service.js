"use strict";

const sendMail = require("../configs/mailer.conf");
const { BadRequestError } = require("../core/error.response");
const { receiveEmailFromQueue } = require("./consumerMail.Service");
const { sendEmailToQueue } = require("./producerMail.service");
const { cacheEmailData } = require("./redis.service");
const { findByEmail } = require("./user.service");

class MailService {
  static sendMailActivattionUser = async (user, activationUrl) => {
    const { name, email } = user;

    const emailData = {
      email: email,
      subject: "Activation your account",
      message: `Hello ${name},please click on the link to activate your account: ${activationUrl}`,
    };

    await sendEmailToQueue(emailData);
    await receiveEmailFromQueue();
  };
}

module.exports = MailService;

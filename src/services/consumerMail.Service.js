"use strict";

const sendMail = require("../configs/mailer.conf");
const { connectToRabbitMQ } = require("../dbs/init_rabbit");

class ConsumerMailService {
  static receiveEmailFromQueue = async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const queue = "email_queue";
      await channel.assertQueue(queue, { durable: false });
      console.log("Waiting for messages in queue mail...");
      channel.consume(queue, (message) => {
        if (message !== null) {
          const emailData = JSON.parse(message.content.toString());
          console.log("Received email from queue:", emailData);
          // Gửi email từ dữ liệu emailData
          // sendEmail(emailData);
          sendMail({
            email: emailData.email,
            subject: emailData.subject,
            message: emailData.message,
          });

          channel.ack(message);
        }
      });
    } catch (error) {
      console.error("Error receiving email from queue:", error);
      throw error;
    }
  };
}

module.exports = ConsumerMailService;

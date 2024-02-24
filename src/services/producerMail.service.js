'use strict'

const { connectToRabbitMQ } = require("../dbs/init_rabbit")


class ProducerMailService {
    static sendEmailToQueue = async (emailData) =>{
        try {
            const {channel,connection } = await connectToRabbitMQ()
            const queue = "email_queue";
            // const message = 'Hello , Cuong dep trai '
            await channel.assertQueue(queue, { durable: false });
            await channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)));
            console.log("Email sent to queue:", emailData);
            await channel.close();
            await connection.close()
        } catch (error) {
            console.error("Error sending email to queue:", error);
            throw error;
        }
    }
}


module.exports = ProducerMailService
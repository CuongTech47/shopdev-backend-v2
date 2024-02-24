'use strict'
const amqp = require('amqplib')
const connectToRabbitMQ = async () => {
    try {
         const connection = await amqp.connect('amqp://localhost')
         if(!connection) throw new Error('Connection RabbitMQ failed ')
         const channel = await connection.createChannel()
         return {channel , connection}
    } catch (error) {
        console.error(`Error connecting to RabbitMQ`,error)
    }
}
module.exports = {
    connectToRabbitMQ
}
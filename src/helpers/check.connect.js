'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections :: ${numConnection}`)
}


// check over load 

const checkOverload = () => {
    setInterval ( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss

        // maximum number of connections based on number osf cores 

        const maxConnections = numCores * 10
        console.log(`Active connections::${numConnection} `)
        console.log(`Memory use :: ${memoryUsage / 1024 / 1024 / 1024} GB`)

        if(numConnection > maxConnections) {
            console.log(`Connection overload detected!`)
        }

    },_SECONDS)
}



module.exports = {
    countConnect,
    checkOverload
}
"use strict";
const mongoose = require("mongoose");

const { db : {host , name , port , user , pass }} = require('../configs/mongodb.conf')
const connectString = `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority&appName=Cluster0/${name}` ;
console.log(connectString)
// const connectString = "mongodb+srv://cuongdev47:cuonglov3@cluster0.evj7cnp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const { countConnect } = require('../helpers/check.connect')
class Database {
    constructor() {
        this.connect()
    }

    //connect

    connect( type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color : true})
        }
       
        mongoose.connect(
            connectString , { maxPoolSize : 50} )
              .then((_) =>  console.log("Connected Mongodb Success", countConnect() ))
              .catch((err) => console.log(`Error Connect!`, err))
    }

    static getIntance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instaceMongodb = Database.getIntance()

module.exports = instaceMongodb
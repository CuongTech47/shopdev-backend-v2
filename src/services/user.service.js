const userModel = require("../models/user.model")

const findByEmail = async ({email})=>{
    return await userModel.findOne({email}).lean()
}


module.exports = {
    findByEmail
}
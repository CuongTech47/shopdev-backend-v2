'use strict'

const sendMail = require("../configs/mailer.conf");
const { BadRequestError } = require("../core/error.response");
const { cacheEmailData } = require("./redis.service");
const { findByEmail } = require("./user.service");



class MailService {
    static sendMailActivattionUser = async(user,activationUrl)=>{
        console.log(activationUrl);

        const userData = await findByEmail({email:user.mail})

        console.log('test mail user',userData)
        
       
        const {name,email,id} = user

        const emailData = {
            email:email,
            subject:"Activation your account",
            message: `Hello ${name},please click on the link to activate your account: ${activationUrl}`
        }
        await cacheEmailData(id,emailData)
        try {
            await sendMail({
                email: email,
                subject: "Activation your account",
                message: `Hello ${name},please click on the link to activate your account: ${activationUrl}`
            })
            
        } catch (error) {
            throw new BadRequestError('Gui mail xac thuc user that bai')
        }
    }
}

module.exports = MailService
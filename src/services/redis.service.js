'use strict'
const redis = require('../configs/redis.conf')
class RedisService {
    // Hàm để lưu trữ thông tin email vào Redis
    static cacheEmailData = async(userId, data)=>{
        const key = `email:${userId}`
        await redis.set(key,JSON.stringify(data))
    }
    // 

    // static sendCachedEmail = 
}

module.exports = RedisService
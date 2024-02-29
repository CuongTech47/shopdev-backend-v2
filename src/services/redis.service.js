"use strict";
const redis = require("../configs/redis.conf");
class RedisService {
  // Hàm để lưu trữ thông tin email vào Redis
  static cacheEmailData = async (userId, data) => {
    const key = `email:${userId}`;
    await redis.set(key, JSON.stringify(data));
  };
  //

  static cacheAvatarData = async (email, avatar) => {
    const key = `avatar:${email}`;

    await redis.set(key, avatar);
    // Đặt hạn cho key trong Redis để tự động xóa sau 5 phút
    await redis.expire(key, 5 * 60);
  };

  static getAvatarDataFromRedis = async (email) => {
    const key = `avatar:${email}`;
    const avatar = await redis.get(key);
    return {
      avatar: avatar,
    };
  };

  static saveUserLoginInfo = async (userId, userData) => {
    const userDataString = JSON.stringify(userData);
    const expirationTimeSeconds = 2 * 24 * 60 * 60; // 2 ngày tính bằng giây
    await redis.set(
      userId,
      userDataString,
      "EX",
      expirationTimeSeconds,
      (err, reply) => {
        if (err) {
          console.error("Error saving user login info:", err);
        } else {
          console.log("User login info saved successfully:", reply);
        }
      }
    );
  };

  static getUserLoginInfo = async (userId) => {
    return new Promise((resolve, reject) => {
      redis.get(userId, (err, reply) => {
        if (err) {
          console.error("Error get user login info:", err);
          reject(err);
        } else {
          console.log("User login info :", reply);
          resolve(reply);
        }
      });
    });
  };

  static delKeyUserLogin = async (userId) => {
    try {
      // Xóa key từ Redis
      const deletedKeysCount = await redis.del(userId);
      console.log(`${deletedKeysCount} key đã được xóa từ Redis.`);
      return deletedKeysCount; // Trả về số lượng key đã bị xóa
    } catch (error) {
      console.error("Lỗi khi xóa key từ Redis:", error);
      throw error;
    }
  };
}

module.exports = RedisService;

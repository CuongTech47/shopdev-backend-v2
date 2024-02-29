const { getUserLoginInfo } = require("./redis.service");

class ShopService {
  static loadShop = async ({ userId }) => {
    const userDataString = await getUserLoginInfo(userId);

    const userData = JSON.parse(userDataString);

    return {
      shop: userData,
    };
  };
}

module.exports = ShopService;

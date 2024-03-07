const { BadRequestError } = require("../core/error.response");
const shopModel = require("../models/shop.model");
const { getUserLoginInfo } = require("./redis.service");

class ShopService {
  static loadShop = async ({ userId }) => {
    const userDataString = await getUserLoginInfo(userId);

    const userData = JSON.parse(userDataString);

    return {
      shop: userData,
    };
  };

  static getShopInfo = async ({ shopId }) => {
    const shop = await shopModel.findById(shopId);

    if (!shop) {
      throw new BadRequestError(`Khong tim thay Shop ID ${shopId}`);
    }

    return {
      shop,
    };
  };
}

module.exports = ShopService;

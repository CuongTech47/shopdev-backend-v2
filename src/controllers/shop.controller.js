'use strict'
const { SuccessResponse } = require("../core/success.response");
const ShopService = require("../services/shop.service");
class ShopController {
  loadShop = async (req, res, next) => {
    // console.log("shop user", req.shop);
    new SuccessResponse({
      message: "Load User success",
      metadata: await ShopService.loadShop({
        userId: req.shop.shopId,
      }),
    }).send(res);
  };

  getShopInfo = async(req , res , next) => {
    new SuccessResponse({
      metadata: await ShopService.getShopInfo({
        shopId: req.params.id
      })
    }).send(res)
  }
}
module.exports = new ShopController()
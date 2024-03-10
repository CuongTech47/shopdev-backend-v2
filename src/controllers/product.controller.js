"use strict";
const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    const { files } = req;
    if (!files || Object.keys(files).length === 0) {
      throw new BadRequestError("File not found");
    }
    new SuccessResponse({
      message: "Create Product Success",
      metadata: await productService.createProduct(
        req.shop,
        { ...req.body },
          files.map(file => file.path)
      ),
    }).send(res);
  };

  getAllProductForShop = async (req, res, next) => {
    // console.log(req.params);
    new SuccessResponse({
      message: "Get all product for shop success",
      metadata: await productService.getAllProductForShop({
        shopId: req.params.id,
      }),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products success",
      metadata: await productService.getAllProducts(),
    }).send(res);
  };

  deleteProductForShop = async (req, res, next) => {
    console.log(req.params);
    new SuccessResponse({
      message: "Delete product for shop success",
      metadata: await productService.deleteProductForShop({
        productId: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();

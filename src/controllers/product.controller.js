"use strict";
const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(req.body);
    let images = [];

    if (!req.body.images) {
      throw new BadRequestError("hình ảnh bị thiếu");
    }
    if (typeof req.body.images === "string") {
      // Nếu chỉ có một hình ảnh, chúng ta đưa nó vào mảng images
      images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
      // Nếu là một mảng, chúng ta duyệt qua từng phần tử và đưa vào mảng images
      for (const image of req.body.images) {
        images.push(image);
      }
    } else {
      // Nếu không phải là một chuỗi hoặc mảng, báo lỗi
      throw new BadRequestError("Định dạng hình ảnh không hợp lệ");
    }

    // console.log("images-product", images);
    new SuccessResponse({
      message: "Create Product Success",
      metadata: await productService.createProduct(
        req.shop,
        { ...req.body },
        images
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

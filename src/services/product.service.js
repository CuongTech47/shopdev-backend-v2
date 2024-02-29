"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const shopModel = require("../models/shop.model");
const { Types } = require("mongoose");
const { uploadMultipleImageFromLocal } = require("./upload.service");
const productModel = require("../models/product.model");

class ProductService {
  static createProduct = async (
    { shopId, email },
    { name, description, category, tags, originalPrice, discountPrice, stock },
    images
  ) => {
    const shop = await shopModel.findOne({ email: email });
    if (!shop) {
      throw new BadRequestError("Shop is invalid!", 400);
    }

  

    const imagesCloud = await uploadMultipleImageFromLocal(
        images,
      `products/${shop._id}`
    );

    const productData = {
      name: name,
      description: description,
      category: category,
      tags: tags,
      originalPrice: originalPrice,
      discountPrice: discountPrice,
      stock: stock,
      images: imagesCloud,
      shopId: new Types.ObjectId(shopId),
    };

    const product = await productModel.create(productData);

    return {
      product,
    };
  };
  static getAllProductForShop = async({shopId}) => {
    const products = await productModel.find({shopId : shopId})
    return {
        products
    }
  }
  static deleteProductForShop = async({productId})=>{
    const product = await productModel.findByIdAndDelete(productId)
    if(!product) throw new NotFoundError(`Không tồn tại product id ${productId} `,404)
    return product
  }
}

module.exports = ProductService;

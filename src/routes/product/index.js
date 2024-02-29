const express = require('express')


const router = express.Router()

const productController = require('../../controllers/product.controller')
const { uploadDisk } = require('../../configs/multer.conf')
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationForShop } = require('../../auth/authUtils');


// create product
router.post('/',uploadDisk.array('images',5),asyncHandler(productController.createProduct))

router.get('/get-all-products-shop/:id',asyncHandler(productController.getAllProductForShop))
router.use(authenticationForShop);
router.delete('/delete-shop-product/:id',asyncHandler(productController.deleteProductForShop))

module.exports = router
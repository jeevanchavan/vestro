import express from 'express'
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct, getAllProducts, getSellerProducts, getProductDetails } from '../controllers/product.controller.js';
import multer from 'multer'
import { createProductValidator } from '../validator/product.validator.js';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})

const productRouter = express.Router()

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
productRouter.post("/",authenticateSeller, upload.array('images', 7),createProductValidator,createProduct);

/** 
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
productRouter.get("/seller",authenticateSeller,getSellerProducts);

/** 
 * @route GET /api/products/
 * @description Get all products visible to user
 * @access Public (all Users)
 */
productRouter.get("/",getAllProducts)

/** 
 * @route GET /api/products/detail/:id
 * @description Get the details of a specific product
 * @access Public (all Users)
 */
productRouter.get("/detail/:id",getProductDetails)

export default productRouter;
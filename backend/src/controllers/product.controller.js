import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async(req,res)=>{
    const {title,description,priceAmount,priceCurrency} = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file)=>{
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    try {
        const product = await productModel.create({
            title,
            description,
            price:{
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        return res.status(201).json({
            message: "Product created Successfully",
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Srever error",
            success: false
        })
    }
}

export const getSellerProducts = async (req,res)=>{
    try {
        const seller = req.user;
        const products = await productModel.find({seller:seller._id});

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server Error ",
            success: false,
        })
    }
}

export const getAllProducts = async (req,res)=>{
    const products = await productModel.find();

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}
import { config } from "dotenv";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const sendJsonWebToken = ()=>{
    const token = jwt.sign(
        {id:user._id},
        config.JWT_SECRET,
        {expiresIn:"7d"}
    )
}

export const registerUser = async(req,res)=>{
    try {
        const {fullname,email,contact,password}= req.body;

        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(existingUser){
            return res.status(400).josn({
                message: "user already exists"
            })
        }

        sendJsonWebToken();

        const user = await userModel.create({
            fullname: user.fullname,
            email:user.email,
            contact: user.contact,
            password
        })
    } catch (error) {
        
    }
}
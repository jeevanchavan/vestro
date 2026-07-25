import { config } from "dotenv";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const sendJsonWebToken = (user,res,message)=>{
    const token = jwt.sign(
        {id:user._id},
        config.JWT_SECRET,
        {expiresIn:"7d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message,
        success:true,
        id:user._id,
        fullname:user.fullname,
        email:user.email,
        contact:user.contact
    })
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
            fullname,
            email,
            contact,
            password
        })

        await sendJsonWebToken(user,res,"User registered Successfully");
    } catch (error) {
        
    }
}
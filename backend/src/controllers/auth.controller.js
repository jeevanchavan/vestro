import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import hash from 'bcryptjs'

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
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const registerUser = async(req,res)=>{
    try {
        const {fullname,email,contact,password,isSeller}= req.body;

        const existingUser = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(existingUser){
            return res.status(400).json({
                message: "user already exists"
            })
        }

        const user = await userModel.create({
            email,
            password,
            contact,
            fullname,
            role: isSeller? "seller":"buyer"
        })

        await sendJsonWebToken(user,res,"User registered Successfully");
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email}).select("+password");
        
        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const isPasswordMatch = await user.comparePassword(password)
        
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        await sendJsonWebToken(user,res,"User loggedIn successfully");
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

export const googleCallback = async (req, res) => {
    const { id, displayName, emails, photos } = req.user
    const email = emails[ 0 ].value;
    const profilePic = photos[ 0 ].value;


    let user = await userModel.findOne({
        email
    })

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
        })
    }


    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.redirect("http://localhost:5173/")
}

export const getMe = async (req,res)=>{
    const user = req.user;

    if(!user){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}
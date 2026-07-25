import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async()=>{
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDb Connected Successfully");
        
    } catch (error) {
        console.error("Error connecting MongoDb",error);
    }
}

export default connectDB;
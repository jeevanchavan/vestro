import express from 'express'
import morgan from 'morgan';
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js";

const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.use(cors({
    origin:"http://localhost:5173",
    method: ["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

import authRouter from './routes/auth.routes.js';

app.use("/api/auth",authRouter);

export default app;
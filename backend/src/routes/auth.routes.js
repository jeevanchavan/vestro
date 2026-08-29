import express from 'express'
import { validateLoginUser, validateRegisterUser } from '../validator/auth.validator.js'
import { getMe, googleCallback, loginUser, registerUser } from '../controllers/auth.controller.js'
import passport from 'passport'
import { config } from '../config/config.js'
import { authUser } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',validateRegisterUser,registerUser)
authRouter.post('/login',validateLoginUser, loginUser)
authRouter.get("/me",authUser,getMe)


// google OAuth Code
authRouter.get("/google",passport.authenticate("google", { scope: [ "profile", "email" ] }))

authRouter.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback,
)

export default authRouter;
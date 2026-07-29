import express from 'express'
import { validateLoginUser, validateRegisterUser } from '../validator/auth.validator.js'
import { googleCallback, loginUser, registerUser } from '../controllers/auth.controller.js'
import passport from 'passport'

const authRouter = express.Router()

authRouter.post('/register',validateRegisterUser,registerUser)
authRouter.post('/login',validateLoginUser, loginUser)


// google OAuth Code
authRouter.get("/google",passport.authenticate("google", { scope: [ "profile", "email" ] }))

authRouter.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        // failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback,
)
// authRouter.get('/get-me')
// authRouter.get('/logout')

export default authRouter;
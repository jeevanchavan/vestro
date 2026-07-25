import express from 'express'
import { validateLoginUser, validateRegisterUser } from '../validator/auth.validator.js'
import { loginUser, registerUser } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register',validateRegisterUser,registerUser)
authRouter.post('/login',validateLoginUser, loginUser)
// authRouter.get('/get-me')
// authRouter.get('/logout')

export default authRouter;
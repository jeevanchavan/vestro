import express from 'express'
import { validateLoginUser, validateRegisterUser } from '../validator/auth.validator.js'
import { registerUser } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register',validateRegisterUser,registerUser)
authRouter.post('/login',validateLoginUser)
authRouter.get('/get-me')
authRouter.get('/logout')

export default authRouter;
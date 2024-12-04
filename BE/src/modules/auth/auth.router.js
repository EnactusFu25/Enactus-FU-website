import expressAsyncHandler from 'express-async-handler'
import { Router } from 'express'

import { validation } from '../../middlewares/validation.middleware.js'
import * as authController from './auth.controller.js'
import * as authValidationSchema from './auth.validationSchema.js'

const router = Router()

// implement forget password and message sending

router.post('/login',
    validation(authValidationSchema.logInSchema),
    expressAsyncHandler(authController.login))
router.post('/signup', 
    validation(authValidationSchema.signUpSchema),
    expressAsyncHandler(authController.signup))
// router.post('/forget-password', authController.forgetPassword)

export default router
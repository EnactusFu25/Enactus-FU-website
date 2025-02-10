import expressAsyncHandler from 'express-async-handler'
import { Router } from 'express'

import { validation } from '../../middlewares/validation.middleware.js'
import * as authController from './auth.controller.js'
import * as authValidationSchema from './auth.validationSchema.js'

const router = Router()


router.post('/login',
    validation(authValidationSchema.logInSchema),
    expressAsyncHandler(authController.login))
router.post('/signup', 
    validation(authValidationSchema.signUpSchema),
    expressAsyncHandler(authController.signup))
router.post('/forget-password',
    validation(authValidationSchema.forgetPasswordSchema),
    expressAsyncHandler(authController.forgetPassword))

router.put('/reset-password',
    validation(authValidationSchema.resetPasswordSchema),
    expressAsyncHandler(authController.resetPassword))

    router.get('/verify-email',
    validation(authValidationSchema.verifyEmailSchema),
    expressAsyncHandler(authController.verifyEmail))

router.post('/resend',
    validation(authValidationSchema.resendEmailSchema),
    expressAsyncHandler(authController.resendEmail))


export default router
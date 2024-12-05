import expressAsyncHandler from "express-async-handler"
import { Router } from "express"

import userEndpoints from "./user.endpoints.js"
import { auth } from "../../middlewares/auth.middleware.js"
import { validation } from "../../middlewares/validation.middleware.js"
import * as userController from "./user.controller.js"
import * as userValidationSchema from "./user.validationSchema.js"

const router = Router()

// implement verify email and sending email messages

router.post("/add-recovery-email",
    validation(userValidationSchema.addRecoveryEmailSchema),
    auth(userEndpoints.manageUser),
    expressAsyncHandler(userController.addRecoveryEmail))
router.patch("/change-recovery-email",
    validation(userValidationSchema.changeRecoveryEmailSchema),
    auth(userEndpoints.manageUser),
    expressAsyncHandler(userController.changeRecoveryEmail))
router.patch("/update-password",
    validation(userValidationSchema.updatePasswordSchema),
    auth(userEndpoints.manageUser),
    expressAsyncHandler(userController.updatePassword))
router.put("/update-data",
    validation(userValidationSchema.updateDataSchema),
    auth(userEndpoints.manageUser),
    expressAsyncHandler(userController.updateData))
// router.post("/verify-email", userController.verifyEmail)

export default router
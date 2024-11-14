import { Router } from "express"
import * as userController from "./user.controller.js"

const router = Router()

// add recovery email
router.post("/add-recovery-email", userController.addRecoveryEmail)
// change recovery email
router.patch("/change-recovery-email", userController.changeRecoveryEmail)
// update password
router.patch("/update-password", userController.updatePassword)
// update data
router.put("/update-data", userController.updateData)
// verify email
// router.post("/verify-email", userController.verifyEmail)

export default router
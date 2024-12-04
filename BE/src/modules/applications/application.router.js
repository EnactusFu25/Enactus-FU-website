import expressAsyncHandler from 'express-async-handler'
import { Router } from 'express'

import applicationEndpoints from './application.endpoints.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { validation } from '../../middlewares/validation.middleware.js'
import * as applicationController from './application.controller.js'
import * as applicationValidationSchema from './application.validationSchema.js'

const router = Router()

// excel sheet and check if we need more validation

router.post('/apply',
    validation(applicationValidationSchema.applySchema),
    expressAsyncHandler(applicationController.apply))
router.get('/applications', 
    validation(applicationValidationSchema.getApplicationsSchema),
    auth(applicationEndpoints.manageApplication),
    expressAsyncHandler(applicationController.getApplications))
router.get('/applications/:id', 
    validation(applicationValidationSchema.getApplicationSchema),
    auth(applicationEndpoints.manageApplication),
    expressAsyncHandler(applicationController.getApplication))
router.patch('/applications/:id',
    validation(applicationValidationSchema.respondToApplicationSchema),
    auth(applicationEndpoints.manageApplication),
    expressAsyncHandler(applicationController.respondToApplication))

// router.get('/applications/excel', applicationController.getExcel)

export default router
import expressAsyncHandler from 'express-async-handler'
import { Router } from 'express'

import formEndpoints from './form.endpoints.js'
import { validation } from '../../middlewares/validation.middleware.js'
import { auth } from '../../middlewares/auth.middleware.js'
import * as formValidationSchema from './form.validationSchema.js'
import * as formController from './form.controller.js'

const router = Router()

router.post('/', 
    validation(formValidationSchema.createFormSchema),
    auth(formEndpoints.manageForm),
    expressAsyncHandler(formController.createForm))
router.patch('/:id',
    validation(formValidationSchema.updateFormSchema),
    auth(formEndpoints.manageForm),
    expressAsyncHandler(formController.updateForm))
router.delete('/:id',
    validation(formValidationSchema.deleteFormSchema),
    auth(formEndpoints.manageForm),
    expressAsyncHandler(formController.deleteForm))

export default router
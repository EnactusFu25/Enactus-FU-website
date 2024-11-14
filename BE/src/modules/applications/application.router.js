import * as applicationController from './application.controller.js'
import {Router} from 'express'

const router = Router()

router.post('/apply', applicationController.apply)
router.get('/applications', applicationController.getApplications)
router.get('/applications/:id', applicationController.getApplication)
router.patch('/applications/:id', applicationController.respondToApplication)

// router.get('/applications/excel', applicationController.getExcel)

export default router
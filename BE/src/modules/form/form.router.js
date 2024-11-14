import * as formController from './form.controller.js'
import {Router} from 'express'

const router = Router()

router.post('/', formController.createForm)
router.patch('/:id', formController.updateForm)
router.delete('/:id', formController.deleteForm)
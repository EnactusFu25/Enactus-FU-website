import expressAsyncHandler from 'express-async-handler'
import { Router } from 'express'

import articleEndpoints from './article.endpoints.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { validation } from '../../middlewares/validation.middleware.js'
import { multerMiddleHost } from '../../middlewares/multer.middleware.js'
import { allowedExtensions } from '../../utils/allowed-extensions.js'
import * as articleValidationSchema from './article.validationSchema.js'
import * as articleController from './article.controller.js'

const router = Router();
// implement images upload
router.get('/',
    validation(articleValidationSchema.getArticlesSchema),
    expressAsyncHandler(articleController.getArticles))
router.get('/:id',
    validation(articleValidationSchema.getArticleSchema),
    expressAsyncHandler(articleController.getArticle))
router.post('/',
    multerMiddleHost(allowedExtensions.image).single('image'),
    validation(articleValidationSchema.createArticleschema),
    auth(articleEndpoints.manageArticle),
    expressAsyncHandler(articleController.createArticle))
router.patch('/:id', 
    multerMiddleHost(allowedExtensions.image).single('image'),
    validation(articleValidationSchema.updateArticleSchema),
    auth(articleEndpoints.manageArticle),
    expressAsyncHandler(articleController.updateArticle))
router.delete('/:id', 
    validation(articleValidationSchema.deleteArticleSchema),
    auth(articleEndpoints.manageArticle),
    expressAsyncHandler(articleController.deleteArticle))

export default router
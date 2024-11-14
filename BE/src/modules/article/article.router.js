import {Router} from 'express';
import * as articleController from './article.controller.js';

const router = Router();

router.get('/', articleController.getArticles)
router.get('/:id', articleController.getArticle)
router.post('/', articleController.createArticle)
router.patch('/:id', articleController.updateArticle)
router.delete('/:id', articleController.deleteArticle)

export default router
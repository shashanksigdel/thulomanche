import express from 'express';
import { getCommentsByPost, createComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/post/:postId', getCommentsByPost);
router.post('/', createComment);
router.delete('/:id', deleteComment);

export default router;

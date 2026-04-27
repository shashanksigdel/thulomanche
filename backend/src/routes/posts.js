import express from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Protected routes (admin only)
router.post('/', protect, authorize(['admin']), createPost);
router.put('/:id', protect, authorize(['admin']), updatePost);
router.delete('/:id', protect, authorize(['admin']), deletePost);

export default router;

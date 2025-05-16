import express from 'express';
import {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  deletePostById
} from '../controllers/postController';

const router = express.Router();

router.get('/', getPosts);
router.get('/:postId', getPostById);
router.post('/', addPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePostById);

export default router;

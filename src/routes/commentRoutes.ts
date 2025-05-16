import express from 'express';
import {
  getComments,
  getCommentById,
  addComment,
  updateComment,
  deleteCommentById,
} from '../controllers/commentController';

const router = express.Router();

router.get('/', getComments);
router.get('/:commentId', getCommentById);
router.post('/', addComment);
router.patch('/:commentId', updateComment);
router.delete('/:commentId', deleteCommentById);

export default router;

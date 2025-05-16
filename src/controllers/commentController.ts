import { Request, Response } from 'express';
import { getDB } from '../utils/db';
import { Comment } from '../models/commentModel';

const COMMENTS_COLLECTION = 'comments';

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const postId = parseInt(req.query.postId as string);
    const query = postId ? { postId } : {};
    const comments = await db.collection<Comment>(COMMENTS_COLLECTION).find(query).toArray();
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const commentId = parseInt(req.params.commentId);
    const comment = await db.collection<Comment>(COMMENTS_COLLECTION).findOne({ id: commentId });
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const newComment: Comment = req.body;

    if (!newComment.id || !newComment.postId || !newComment.name || !newComment.email || !newComment.body) {
      res.status(400).json({ error: 'Missing comment fields' });
      return;
    }

    await db.collection<Comment>(COMMENTS_COLLECTION).insertOne(newComment);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const deleteCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const commentId = parseInt(req.params.commentId);
    const result = await db.collection<Comment>(COMMENTS_COLLECTION).deleteOne({ id: commentId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const commentId = parseInt(req.params.commentId);
    const updateFields: Partial<Comment> = req.body;

    const result = await db.collection<Comment>(COMMENTS_COLLECTION).updateOne(
      { id: commentId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const updatedComment = await db.collection<Comment>(COMMENTS_COLLECTION).findOne({ id: commentId });
    res.status(200).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};
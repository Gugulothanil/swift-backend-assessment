import { Request, Response } from 'express';
import { getDB } from '../utils/db';
import { Post } from '../models/postModel';

const POSTS_COLLECTION = 'posts';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // userId is optional query param, if present filter posts by it
    const userIdStr = req.query.userId as string | undefined;
    let query = {};

    if (userIdStr) {
      const userId = parseInt(userIdStr);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid userId query parameter' });
        return;
      }
      query = { userId };
    }

    const posts = await db.collection<Post>(POSTS_COLLECTION)
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments(query);

    res.status(200).json({
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid postId parameter' });
      return;
    }

    const post = await db.collection<Post>(POSTS_COLLECTION).findOne({ id: postId });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const newPost: Post = req.body;

    // Basic validation
    if (
      typeof newPost.id !== 'number' ||
      typeof newPost.userId !== 'number' ||
      typeof newPost.title !== 'string' ||
      typeof newPost.body !== 'string'
    ) {
      res.status(400).json({ error: 'Missing or invalid post fields (id, userId, title, body)' });
      return;
    }

    // Check if post with same id already exists
    const existingPost = await db.collection<Post>(POSTS_COLLECTION).findOne({ id: newPost.id });
    if (existingPost) {
      res.status(409).json({ error: 'Post with this id already exists' });
      return;
    }

    await db.collection<Post>(POSTS_COLLECTION).insertOne(newPost);
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid postId parameter' });
      return;
    }

    const updates = req.body;
    // You might want to restrict which fields can be updated, add validation here if needed.

    const result = await db.collection<Post>(POSTS_COLLECTION).updateOne(
      { id: postId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const updatedPost = await db.collection<Post>(POSTS_COLLECTION).findOne({ id: postId });
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid postId parameter' });
      return;
    }

    const result = await db.collection<Post>(POSTS_COLLECTION).deleteOne({ id: postId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};


















// import { Request, Response } from 'express';
// import { getDB } from '../utils/db';
// import { Post } from '../models/postModel';

// const POSTS_COLLECTION = 'posts';

// export const getPosts = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;
//     const userId = parseInt(req.query.userId as string);

//     const query = userId ? { userId } : {};
//     const posts = await db.collection<Post>(POSTS_COLLECTION)
//       .find(query)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const totalPosts = await db.collection<Post>(POSTS_COLLECTION).countDocuments(query);

//     res.status(200).json({
//       page,
//       limit,
//       totalPosts,
//       totalPages: Math.ceil(totalPosts / limit),
//       posts,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch posts' });
//   }
// };

// export const getPostById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const postId = parseInt(req.params.postId);
//     const post = await db.collection<Post>(POSTS_COLLECTION).findOne({ id: postId });

//     if (!post) {
//       res.status(404).json({ error: 'Post not found' });
//       return;
//     }

//     res.status(200).json(post);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch post' });
//   }
// };

// export const addPost = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const newPost: Post = req.body;

//     if (!newPost.id || !newPost.userId || !newPost.title || !newPost.body) {
//       res.status(400).json({ error: 'Missing post fields' });
//       return;
//     }

//     await db.collection<Post>(POSTS_COLLECTION).insertOne(newPost);
//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create post' });
//   }
// };

// export const deletePostById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const postId = parseInt(req.params.postId);
//     const result = await db.collection<Post>(POSTS_COLLECTION).deleteOne({ id: postId });

//     if (result.deletedCount === 0) {
//       res.status(404).json({ error: 'Post not found' });
//       return;
//     }

//     res.status(200).json({ message: 'Post deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete post' });
//   }
// };

// export const updatePost = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const postId = parseInt(req.params.postId);
//     const updates = req.body;

//     const result = await db.collection<Post>(POSTS_COLLECTION).updateOne(
//       { id: postId },
//       { $set: updates }
//     );

//     if (result.matchedCount === 0) {
//       res.status(404).json({ error: 'Post not found' });
//       return;
//     }

//     const updatedPost = await db.collection<Post>(POSTS_COLLECTION).findOne({ id: postId });
//     res.status(200).json(updatedPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update post' });
//   }
// };


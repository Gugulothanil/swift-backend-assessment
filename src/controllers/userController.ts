import { Request, Response } from 'express';
import { getDB } from '../utils/db';
import { User } from '../models/userModel';

const USERS_COLLECTION = 'users';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const users = await db.collection<User>(USERS_COLLECTION).find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const userId = parseInt(req.params.userId);
    const user = await db.collection<User>(USERS_COLLECTION).findOne({ id: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const newUser: User = req.body;

    if (
      typeof newUser !== 'object' ||
      !newUser.id ||
      !newUser.name ||
      !newUser.username ||
      !newUser.email
    ) {
      res.status(400).json({ error: 'Missing user fields' });
      return;
    }

    // Optional: Check for duplicate ID before insert
    const existing = await db.collection<User>(USERS_COLLECTION).findOne({ id: newUser.id });
    if (existing) {
      res.status(409).json({ error: 'User with this ID already exists' });
      return;
    }

    await db.collection<User>(USERS_COLLECTION).insertOne(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const userId = parseInt(req.params.userId);
    const updateData: Partial<User> = req.body;

    const result = await db.collection<User>(USERS_COLLECTION).updateOne(
      { id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const userId = parseInt(req.params.userId);
    const result = await db.collection<User>(USERS_COLLECTION).deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};















// import { Request, Response } from 'express';
// import axios from 'axios';
// import { getDB } from '../utils/db';
// import { User } from '../models/userModel';

// const USERS_COLLECTION = 'users';
// const POSTS_COLLECTION = 'posts';
// const COMMENTS_COLLECTION = 'comments';

// const userCache = new Map<string, { data: User; timestamp: number }>();
// const CACHE_DURATION = 60 * 1000; // 60 seconds

// export const loadData = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const usersRes = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users?_limit=10');
//     const users = usersRes.data;

//     for (const user of users) {
//       const postsRes = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
//       const posts = postsRes.data;

//       for (const post of posts) {
//         const commentsRes = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
//         post.comments = commentsRes.data;
//       }

//       user.posts = posts;
//     }

//     await db.collection(USERS_COLLECTION).deleteMany({});
//     await db.collection(USERS_COLLECTION).insertMany(users);

//     res.status(200).json({ message: 'Data loaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to load data' });
//   }
// };

// export const deleteAllUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     await db.collection(USERS_COLLECTION).deleteMany({});
//     res.status(200).json({ message: 'All users deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to delete users' });
//   }
// };

// export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const userId = parseInt(req.params.userId);
//     const result = await db.collection(USERS_COLLECTION).deleteOne({ id: userId });

//     if (result.deletedCount === 0) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     userCache.delete(req.params.userId);
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// };

// export const getUserById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.params.userId;

//     if (userCache.has(userId)) {
//       const cached = userCache.get(userId)!;
//       if (Date.now() - cached.timestamp < CACHE_DURATION) {
//         res.status(200).json(cached.data);
//         return;
//       } else {
//         userCache.delete(userId);
//       }
//     }

//     const db = getDB();
//     const idNum = parseInt(userId);
//     const user = await db.collection<User>(USERS_COLLECTION).findOne({ id: idNum });

//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     userCache.set(userId, { data: user, timestamp: Date.now() });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     let sort: Record<string, 1 | -1> = {};
//     const sortParam = req.query.sort as string;
//     if (sortParam) {
//       if (sortParam.startsWith('-')) {
//         sort[sortParam.substring(1)] = -1;
//       } else {
//         sort[sortParam] = 1;
//       }
//     }

//     const users = await db.collection<User>(USERS_COLLECTION)
//       .find()
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const totalUsers = await db.collection<User>(USERS_COLLECTION).countDocuments();

//     res.status(200).json({
//       page,
//       limit,
//       totalUsers,
//       totalPages: Math.ceil(totalUsers / limit),
//       users,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// export const addUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const newUser: User = req.body;

//     if (!newUser.id || !newUser.name || !newUser.username || !newUser.email) {
//       res.status(400).json({ error: 'Missing required user fields' });
//       return;
//     }

//     const existingUser = await db.collection(USERS_COLLECTION).findOne({ id: newUser.id });
//     if (existingUser) {
//       res.status(400).json({ error: 'User already exists.' });
//       return;
//     }

//     await db.collection(USERS_COLLECTION).insertOne(newUser);
//     userCache.delete(String(newUser.id));
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to add user' });
//   }
// };

// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const db = getDB();
//     const userId = parseInt(req.params.userId);
//     const updates = req.body;

//     const result = await db.collection<User>(USERS_COLLECTION).updateOne(
//       { id: userId },
//       { $set: updates }
//     );

//     if (result.matchedCount === 0) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     userCache.delete(String(userId));

//     const updatedUser = await db.collection<User>(USERS_COLLECTION).findOne({ id: userId });
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to update user' });
//   }
// };

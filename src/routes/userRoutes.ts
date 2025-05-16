import { Router } from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);             // ✅ This will now match POST /users
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);
export default router;

// import { Router } from 'express';
// import {
//     getUsers,
//   loadData,
//   deleteAllUsers,
//   deleteUserById,
//   getUserById,
//   addUser,
// } from '../controllers/userController';

// const router = Router();

// // Load users, posts, and comments from external API and save to DB
// router.get('/load', loadData);

// // DELETE all users
// router.delete('/', deleteAllUsers);

// // DELETE a user by ID
// router.delete('/:userId', deleteUserById);

// // GET a user by ID
// router.get('/:userId', getUserById);

// // PUT: Add a new user
// router.put('/', addUser);


// // New route: GET /users with pagination & sorting
// router.get('/users', getUsers);

// export default router;

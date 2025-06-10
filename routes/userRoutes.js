import express from 'express';
import { createNewUsers, getUsers, getUserById, deleteUser, updateUser, getCurrentUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createNewUsers);

// Protected routes (authentication required)
router.use(authenticateToken);

router.get('/', getUsers);
router.get('/me', getCurrentUser); // Get current logged-in user info
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);

export default router;
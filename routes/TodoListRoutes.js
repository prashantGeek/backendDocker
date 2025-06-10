import express from 'express';
import { getAllLists, createNewList, getListById, deleteList, updateList } from '../controllers/TodoListController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(authenticateToken);

// Route to get all lists for authenticated user
router.get('/', getAllLists);
// Route to create a new list for authenticated user
router.post('/', createNewList);
// Route to get a list by ID for authenticated user
router.get('/:id', getListById);
// Route to delete a list by ID for authenticated user
router.delete('/:id', deleteList);
// Route to update a list by ID for authenticated user
router.patch('/:id', updateList);

export default router;
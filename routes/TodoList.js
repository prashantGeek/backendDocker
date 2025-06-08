import express from 'express';
import { getAllLists, createNewList, getListById, deleteList, updateList } from '../controllers/TodoList.js';
const router = express.Router();
// Route to get all lists
router.get('/', getAllLists);
// Route to create a new list
router.post('/', createNewList);
// Route to get a list by ID
router.get('/:id', getListById);
// Route to delete a list by ID
router.delete('/:id', deleteList);
// Route to update a list by ID
router.patch('/:id', updateList);
export default router;
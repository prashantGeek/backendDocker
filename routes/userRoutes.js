 import express from 'express'

 const router = express.Router()

import { createNewUsers ,getUsers, getUserById, deleteUser, updateUser} from '../controllers/userController.js';

 router.get('/', getUsers)

 router.post('/', createNewUsers)

 router.get('/:id', getUserById)

 router.delete('/:id', deleteUser)

 router.patch('/:id', updateUser)
 
 export default router;
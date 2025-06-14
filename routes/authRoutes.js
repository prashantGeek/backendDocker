import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// Route for user registration

router.get('/', (req, res) => {
  res.send('Authentication routes');
});

router.get('/register', (req, res) => {
  res.send('User registration page');
});
router.post('/register', registerUser);

// Route for user login
router.get('/login', (req, res) => {
  res.send('User login page');
});
router.post('/login', loginUser);

// Route for user logout
router.post('/logout', logoutUser);

export default router;
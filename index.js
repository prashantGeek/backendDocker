import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes.js';
import ListRoutes from './routes/TodoListRoutes.js';
import AuthRoutes from './routes/authRoutes.js';
import connectDB from './database/db.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/users', UserRoutes);
app.use('/lists', ListRoutes);
app.use('/auth', AuthRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
import express from 'express';
import authRoutes from './src/routes/auth.route';
import userRoutes from './src/routes/user.route';
import { authenticate } from "./src/middlewares/auth.middleware";

const app = express();
app.use(express.json());

app.use('/auth', authRoutes)

app.use('/user', authenticate, userRoutes)

module.exports = app;


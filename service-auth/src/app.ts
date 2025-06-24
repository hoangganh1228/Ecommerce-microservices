import express from 'express';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import { authenticate } from "./middlewares/auth.middleware";

const app = express();
app.use(express.json());

app.use('/auth', authRoutes)

app.use('/user', authenticate, userRoutes)

export default app;;


import express from 'express';
import authRoutes from './src/routes/auth.route';
const app = express();
app.use(express.json());

app.use('/auth', authRoutes)

module.exports = app;


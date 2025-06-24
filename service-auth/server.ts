import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { config } from 'dotenv';
import app from './src/app'; 

config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Database connection error', err);
  });

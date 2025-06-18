import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { config } from 'dotenv'; 

config();
const app = require('./app');

const PORT = process.env.PORT || 3000;


AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on ${PORT}`);
    });
  })
  .catch((err : any) => {
    console.error('❌ Database connection error', err);
  });
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from '../models/Account';
import { OtpCode } from '../models/OtpCode';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_service',
  synchronize: true,
  entities: [Account, OtpCode],
});
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from '../entity/Account';
import { OtpCode } from '../entity/OtpCode';
import { User } from '../entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_service',
  synchronize: true,
  entities: [Account, OtpCode, User],
});
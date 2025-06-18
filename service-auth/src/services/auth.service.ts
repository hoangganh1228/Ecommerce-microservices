import { AppDataSource } from "../config/data-source";
import { Account } from "../models/Account";
import bcrypt from 'bcrypt';
import { signToken } from "../utils/jwt";

export class AuthService {
    private userRepo = AppDataSource.getRepository(Account);
    
    async register(email: string, password: string) {
        const existing = await this.userRepo.findOne({ where: {email} });
        if (existing) throw new Error('Email already registered');
        const hashed = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({ email, password: hashed });
        return this.userRepo.save(user);
    }
    
    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email }});
        if (!user) throw new Error('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid credentials');
        
        const token = signToken({email: user.email});
        
        return token;
    }
} 

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.accountRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already exists');
    const hashed = await bcrypt.hash(dto.password, 10);
    const account = this.accountRepo.create({
      email: dto.email,
      password: hashed,
    });
    const saved = await this.accountRepo.save(account);

    const user = this.userRepo.create({
      accountId: saved.id,
      fullName: dto.fullName,
    });
    await this.userRepo.save(user);

    return { message: 'Register successful' };
  }

  async login(dto: LoginDto) {
    const account = await this.accountRepo.findOne({
      where: { email: dto.email },
    });
    if (!account || account.isDeleted || !account.isActive)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, account.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: account.email, sub: account.id };
    const accessToken = this.jwtService.sign(payload);

    return { message: 'Login successful', accessToken };
  }
}

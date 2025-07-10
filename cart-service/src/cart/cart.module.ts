import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from 'src/common/redis/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    HttpModule,
    RedisModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

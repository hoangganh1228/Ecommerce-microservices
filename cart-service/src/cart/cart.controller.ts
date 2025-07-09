import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './schemas/cart.schema';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Controller('cart/:userId')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Param('userId') userId: string): Promise<Cart> {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addItem(
    @Param('userId') userId: string,
    @Body() item: AddCartItemDto,
  ): Promise<Cart> {
    return this.cartService.addItem(userId, item);
  }

  @Post('remove')
  async removeItem(
    @Param('userId') userId: string,
    @Body() body: { product_id: string },
  ): Promise<Cart> {
    return this.cartService.removeItem(userId, body.product_id);
  }

  @Post('checkout')
  async checkout(@Param('userId') userId: string)  {
    return this.cartService.checkout(userId);
  }
}

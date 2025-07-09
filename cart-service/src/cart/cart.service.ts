import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import { HttpService } from '@nestjs/axios';

export class OrderResponseDto {
  id: string;
  status: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    return cart ?? { userId, items: [] };
  }

  async addItem(userId: string, item: AddCartItemDto): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    const product = await this.fetchProduct(item.product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newItem: any = {
      product_id: product._id,
      product_name: product.name,
      product_price: product.price,
      quantity: item.quantity,
      final_price: product.price * item.quantity,
    };
    if (!cart) {
      return this.cartModel.create({
        userId,
        items: [newItem],
      });
    }

    // Tìm item đã tồn tại trong cart
    const existingItemIndex = cart.items.findIndex(
      (i) => i.product_id === newItem.product_id,
    );

    if (existingItemIndex !== -1) {
      // Cập nhật quantity của item đã tồn tại
      cart.items[existingItemIndex].quantity += newItem.quantity;
      cart.items[existingItemIndex].final_price =
        cart.items[existingItemIndex].quantity *
        cart.items[existingItemIndex].product_price;
    } else {
      // Thêm item mới
      cart.items.push(newItem);
    }

    return cart.save();
  }

  async removeItem(userId: string, product_id: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find((i) => i.product_id === product_id);
    if (!item) throw new Error('Item not found');

    cart.items = cart.items.filter((i) => i.product_id !== product_id);
    return cart.save();
  }

  async checkout(userId: string) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }
    try {
      const url = this.configService.get<string>('ORDER_SERVICE_URL');
      // console.log('cart', cart.items);
      const response = await axios.post<OrderResponseDto>(`${url}/orders`, {
        user_id: userId,
        items: cart.items,
        note: 'Checkout từ cart-service',
      });
      await this.cartModel.deleteOne({ userId });

      return {
        orderId: response.data.id,
        status: response.data.status,
      };
    } catch (error) {
      throw new Error('Failed to checkout');
    }
    // Handle RabbitMQ
  }

  private async fetchProduct(productId: string) {
    const productUrl = `${this.configService.get('PRODUCT_SERVICE_URL')}/products/${productId}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get<ProductResponseDto>(productUrl).pipe(
          timeout(2000),
          catchError(() => of({ data: null })),
        ),
      );
      const data = response.data;
      return data;
    } catch (err: any) {
      return err.response.data;
    }
  }
}

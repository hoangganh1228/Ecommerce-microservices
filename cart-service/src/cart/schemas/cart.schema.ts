import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 2 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CartItem {
  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  product_name: string;

  @Prop()
  product_price: number;

  @Prop()
  final_price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

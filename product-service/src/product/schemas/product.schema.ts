import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;
    
    @Prop([String])
    images: string[];

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: Types.ObjectId, ref: 'Category' })
    category_id: Types.ObjectId;

    @Prop({ unique: true })
    slug: string;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deleted_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
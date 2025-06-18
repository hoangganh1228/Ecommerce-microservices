import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Category extends Document {
    @Prop({required: true})
    name: string;

    @Prop({ unique: true })
    slug: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parent_id?: Types.ObjectId;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deleted_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category)
export type CategoryDocument = Category & Document;
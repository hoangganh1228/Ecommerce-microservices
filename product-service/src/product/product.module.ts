import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './product.repository';
import { CloudinaryProvider } from 'src/common/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { ImageUploadService } from 'src/common/image/image-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, CloudinaryProvider, CloudinaryService, ImageUploadService],
  exports: [ProductRepository]
})
export class ProductModule {}

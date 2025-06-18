import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository]
})
export class ProductModule {}

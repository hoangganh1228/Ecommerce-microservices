import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImageUploadService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  async attachImages<T extends { images?: string[] }>(
    dto: T,
    files: Express.Multer.File[],
  ): Promise<void> {
    if (files?.length) {
      const urls = await this.cloudinary.uploadMultiple(files);
      dto.images = urls;
    }
  }
}
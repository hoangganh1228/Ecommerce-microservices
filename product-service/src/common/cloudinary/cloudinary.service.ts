import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinaryType } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  
    constructor(@Inject('CLOUDINARY') private cloudinary: typeof cloudinaryType) {}

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
        this.cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
                if (error || !result) return reject(error || new Error('Upload failed'));
                resolve(result);
            },
        ).end(file.buffer);
        });
    }

    async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
        const results = await Promise.all(
            files.map((file) => this.uploadImage(file)),
        );
        return results.map((res) => res.secure_url);
    }
}


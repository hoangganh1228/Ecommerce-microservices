import { Express } from 'express';

export async function attachImagesToDto<T extends { images?: string[] }>(
  dto: T,
  files: Express.Multer.File[],
  uploadFn: (files: Express.Multer.File[]) => Promise<string[]>
): Promise<T> {
  if (files?.length) {
    dto.images = await uploadFn(files);
  }
  return dto;
}
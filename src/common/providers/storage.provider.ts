import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageProvider {
  private readonly uploadDir =
    process.env.UPLOAD_DIR && process.env.UPLOAD_DIR.trim() !== ''
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'uploads');

  async uploadMedia(file: any): Promise<string> {
    if (!file) throw new Error('No file provided');

    // Validate file has data
    if (!file.buffer) {
      throw new Error('File buffer is missing');
    }

    if (file.buffer.length === 0) {
      throw new Error('File buffer is empty');
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthDir = path.join(this.uploadDir, year.toString(), month);

    await fs.mkdir(monthDir, { recursive: true });

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const normalizedName = `${nameWithoutExt}-${timestamp}${ext}`;

    const filePath = path.join(monthDir, normalizedName);

    await fs.writeFile(filePath, file.buffer);

    return `/uploads/${year}/${month}/${normalizedName}`;
  }

  async deleteMedia(imageUrl: string): Promise<void> {
    if (!imageUrl || imageUrl.startsWith('http')) return;

    const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;

    const filePath = path.resolve(this.uploadDir, path.relative('uploads', relativePath));

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw new InternalServerErrorException('Error deleting media file');
      }
    }
  }

  async uploadMedias(files: any[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadMedia(file)));
  }

  async uploadBase64(base64String: string): Promise<string> {
    if (!base64String) throw new Error('No base64 string provided');

    // Parse base64 string: format should be "data:image/png;base64,..."
    const base64Match = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Invalid base64 string format');
    }

    const [, extension, base64Data] = base64Match;
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate buffer
    if (buffer.length === 0) {
      throw new Error('Base64 buffer is empty');
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthDir = path.join(this.uploadDir, year.toString(), month);

    await fs.mkdir(monthDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `base64-${timestamp}-${randomStr}.${extension}`;
    const filePath = path.join(monthDir, fileName);

    await fs.writeFile(filePath, buffer);

    return `/uploads/${year}/${month}/${fileName}`;
  }

  async uploadBase64Batch(base64Strings: string[]): Promise<string[]> {
    return Promise.all(base64Strings.map((base64) => this.uploadBase64(base64)));
  }
}

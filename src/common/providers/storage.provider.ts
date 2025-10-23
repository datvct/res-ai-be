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
}

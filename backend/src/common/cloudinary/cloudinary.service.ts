import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    publicId?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      };

      if (publicId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        uploadOptions.public_id = publicId;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        uploadOptions.overwrite = true;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new BadRequestException(`Error subiendo imagen: ${error.message}`));
          } else if (result) {
            resolve(result);
          }
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error eliminando imagen de Cloudinary:', error);
    }
  }

  extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }

  isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com');
  }
}

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Client } from 'minio';
import { storageConfig } from '../config/storageConfig';
import { LanguageTranslations } from '../types/languageTranslations';
import HTTP_STATUS from '../utils/httpStatus';

const unlinkAsync = promisify(fs.unlink);

export class UploadFileService {
  private readonly isS3: boolean;
  private readonly s3Client: Client | null;
  private readonly localDir: string | undefined;
  private readonly bucketName: string;
  private readonly expirationTime: number;

  constructor() {
    this.isS3 = storageConfig.type === 's3';
    this.bucketName = storageConfig.s3.bucketName;
    this.expirationTime = storageConfig.expirationTime;

    if (this.isS3) {
      this.s3Client = new Client({
        endPoint: storageConfig.s3.endPoint,
        accessKey: storageConfig.s3.accessKey,
        secretKey: storageConfig.s3.secretKey,
        useSSL: storageConfig.s3.useSSL,
      });
    } else {
      this.s3Client = null;
      this.localDir = path.join(
        __dirname,
        '../../',
        storageConfig.local.uploadDir
      );
      if (!fs.existsSync(this.localDir)) {
        fs.mkdirSync(this.localDir, { recursive: true });
      }
    }
  }

  async uploadFile(
    { file }: { file: Express.Multer.File },
    translations: LanguageTranslations
  ): Promise<string> {
    if (!file) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        message: translations.file.notProvided,
      };
    }
    const { originalname: fileName, buffer: fileBuffer } = file;

    if (this.isS3 && this.s3Client) {
      await this.s3Client.putObject(this.bucketName, fileName, fileBuffer);
      return fileName;
    } else {
      const filePath = path.join(this.localDir!, fileName);
      fs.writeFileSync(filePath, fileBuffer);
      return fileName;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    if (this.isS3 && this.s3Client) {
      await this.s3Client.removeObject(this.bucketName, fileName);
    } else {
      const filePath = path.join(this.localDir!, fileName);
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
      } else {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: 'File not found',
        };
      }
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    if (this.isS3 && this.s3Client) {
      // Generate a pre-signed URL for S3
      const presignedUrl = await this.s3Client.presignedGetObject(
        this.bucketName,
        fileName,
        this.expirationTime
      );
      return presignedUrl;
    } else if (this.localDir) {
      const filePath = path.join(this.localDir, fileName);

      if (!fs.existsSync(filePath)) {
        throw {
          status: HTTP_STATUS.NOT_FOUND,
          message: 'File not found',
        };
      }

      const localBaseUrl = storageConfig.local.localBaseURL;
      const localEntryURL = storageConfig.local.localEntryURL;

      return `${localBaseUrl}/${localEntryURL}/${fileName}`;
    } else {
      throw {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Invalid file storage configuration',
      };
    }
  }
}
export default new UploadFileService();

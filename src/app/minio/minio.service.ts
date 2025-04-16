import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { minioConfig } from '@const';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: minioConfig.minioServer,
      port: 443,
      useSSL: minioConfig.minioSSL,
      accessKey: minioConfig.minioAccessKey,
      secretKey: minioConfig.minioSecretKey,
    });
    this.logger.log('MinioService initialized');
  }

  /**
   * Upload file to Minio
   * @param bucketName - Bucket name (will be created if not exists)
   * @param objectName - Object name in bucket
   * @param filePath - Local file path to upload
   * @param metaData - Optional metadata
   * @returns Promise with upload info
   */
  async uploadFile(
    bucketName: string,
    objectName: string,
    filePath: string,
    metaData?: Minio.ItemBucketMetadata,
  ): Promise<{ etag: string; versionId: string | null }> {
    try {
      // Ensure bucket exists
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        this.logger.log(`Bucket '${bucketName}' created successfully.`);
        
        // Thiết lập chính sách public cho bucket mới tạo
        const publicPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: [
                's3:GetBucketLocation',
                's3:ListBucket',
                's3:GetObject',
              ],
              Resource: [
                `arn:aws:s3:::${bucketName}`,
                `arn:aws:s3:::${bucketName}/*`,
              ],
            },
          ],
        };
        
        await this.minioClient.setBucketPolicy(
          bucketName, 
          JSON.stringify(publicPolicy)
        );
        this.logger.log(`Public access policy set for bucket '${bucketName}'`);
      }
  
      // Upload file
      return await this.minioClient.fPutObject(
        bucketName,
        objectName,
        filePath,
        metaData || {},
      );
    } catch (error) {
      this.logger.error(`Error uploading file to Minio: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a presigned URL for an object
   * @param bucketName - Bucket name
   * @param objectName - Object name in bucket
   * @param expiryInSeconds - URL expiry time in seconds (default 7 days)
   * @returns Presigned URL string
   */
  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expiryInSeconds = 604800,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        expiryInSeconds,
      );
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if an object exists in a bucket
   * @param bucketName - Bucket name
   * @param objectName - Object name in bucket
   * @returns Promise<boolean> - true if object exists
   */
  async objectExists(bucketName: string, objectName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(bucketName, objectName);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Delete an object from a bucket
   * @param bucketName - Bucket name
   * @param objectName - Object name in bucket
   */
  async deleteObject(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      this.logger.log(
        `Object '${objectName}' deleted from bucket '${bucketName}'`,
      );
    } catch (error) {
      this.logger.error(`Error deleting object: ${error.message}`);
      throw error;
    }
  }
}

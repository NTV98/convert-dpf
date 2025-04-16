import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, parse } from 'path';
import * as mammoth from 'mammoth';
import * as puppeteer from 'puppeteer';

// Define the mammoth types since they're not included in the package
declare namespace mammoth {
  interface Options {
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: any;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: any;
  }
}
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConvertOptionsDto } from './dto/convert-options.dto';
import { Multer } from 'multer';
import * as https from 'https';
import * as http from 'http';
import * as path from 'path';
import { MinioService } from '../minio/minio.service';
import { v4 as uuidv4 } from 'uuid';
import { BUCKET } from '@const';
import { KafkaService } from '@broker/kafka.service';
const execPromise = promisify(exec);

@Injectable()
export class ConvertService {
  private readonly logger = new Logger(ConvertService.name);
  private readonly tempDir = join(process.cwd(), 'temp');

  constructor(private minioService: MinioService) {
    // Ensure temp directory exists
    this.ensureTempDir();
  }

  private async ensureTempDir(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
      this.logger.log(`Temporary directory created at: ${this.tempDir}`);
    } catch (error) {
      this.logger.error(`Failed to create temp directory: ${error.message}`);
      throw error;
    }
  }

  async convertDocxToPDF(url: string): Promise<string> {
    try {
      // Generate unique filename to avoid collisions
      const uniqueId = uuidv4();
      const originalFilename = path.basename(url);
      const fileExt = path.extname(originalFilename);
      const fileNameWithoutExt = path.basename(originalFilename, fileExt);
      
      // Create filenames for source and output
      const downloadedFilePath = join(this.tempDir, `${uniqueId}_${originalFilename}`);
      
      // Download file from URL
      this.logger.log(`Downloading file from: ${url}`);
      await this.downloadFile(url, downloadedFilePath);
      this.logger.log(`File downloaded to: ${downloadedFilePath}`);
      
      // Use normalized paths with quotes for LibreOffice
      const normalizedFilePath = path.normalize(downloadedFilePath);
      const normalizedTempDir = path.normalize(this.tempDir);
      const sofficeCmd = `soffice --headless --convert-to pdf "${normalizedFilePath}" --outdir "${normalizedTempDir}"`;
      
      this.logger.log("👉 Running LibreOffice command:");
      this.logger.log(sofficeCmd);
      
      // Execute conversion
      const { stdout, stderr } = await execPromise(sofficeCmd);
      
      if (stderr) this.logger.warn("⚠️ stderr:", stderr);
      this.logger.log("✅ stdout:", stdout);
      this.logger.log("🎉 Conversion complete!");
      
      // PDF file path (LibreOffice uses the same name but with .pdf extension)
      const pdfFilePath = join(this.tempDir, `${uniqueId}_${fileNameWithoutExt}.pdf`);
      
      // Check if PDF file exists
      try {
        await fs.access(pdfFilePath);
      } catch (error) {
        throw new Error(`PDF file not created: ${error.message}`);
      }
      
      // Upload file to MinIO
      this.logger.log(`Uploading PDF to MinIO: ${pdfFilePath}`);
      const objectName = `pdf/${fileNameWithoutExt}_${uniqueId}.pdf`;
      
      await this.minioService.uploadFile(
        BUCKET, 
        objectName, 
        pdfFilePath,
        { 'Content-Type': 'application/pdf' }
      );
      
      // Get a presigned URL for the uploaded PDF
      const fileUrl = await this.minioService.getPresignedUrl(
        BUCKET,
        objectName,
        604800  // URL valid for 7 days
      );
      
      // Clean up temporary files
      await this.cleanupFiles(downloadedFilePath, pdfFilePath);
      
      return fileUrl;
    } catch (error) {
      this.logger.error("❌ Error during conversion or upload:", error.message);
      throw new HttpException(
        `Failed to convert or upload PDF: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async convertDocxToPDFKafka(url: string, topic: string,kafkaService: KafkaService): Promise<void> {
    try {
      // Generate unique filename to avoid collisions
      const uniqueId = uuidv4();
      const originalFilename = path.basename(url);
      const fileExt = path.extname(originalFilename);
      const fileNameWithoutExt = path.basename(originalFilename, fileExt);
      
      // Create filenames for source and output
      const downloadedFilePath = join(this.tempDir, `${uniqueId}_${originalFilename}`);
      
      // Download file from URL
      this.logger.log(`Downloading file from: ${url}`);
      await this.downloadFile(url, downloadedFilePath);
      this.logger.log(`File downloaded to: ${downloadedFilePath}`);
      
      // Use normalized paths with quotes for LibreOffice
      const normalizedFilePath = path.normalize(downloadedFilePath);
      const normalizedTempDir = path.normalize(this.tempDir);
      const sofficeCmd = `soffice --headless --convert-to pdf "${normalizedFilePath}" --outdir "${normalizedTempDir}"`;
      
      this.logger.log("👉 Running LibreOffice command:");
      this.logger.log(sofficeCmd);
      
      // Execute conversion
      const { stdout, stderr } = await execPromise(sofficeCmd);
      
      if (stderr) this.logger.warn("⚠️ stderr:", stderr);
      this.logger.log("✅ stdout:", stdout);
      this.logger.log("🎉 Conversion complete!");
      
      // PDF file path (LibreOffice uses the same name but with .pdf extension)
      const pdfFilePath = join(this.tempDir, `${uniqueId}_${fileNameWithoutExt}.pdf`);
      
      // Check if PDF file exists
      try {
        await fs.access(pdfFilePath);
      } catch (error) {
        throw new Error(`PDF file not created: ${error.message}`);
      }
      
      // Upload file to MinIO
      this.logger.log(`Uploading PDF to MinIO: ${pdfFilePath}`);
      const objectName = `pdf/${fileNameWithoutExt}_${uniqueId}.pdf`;
      
      await this.minioService.uploadFile(
        BUCKET, 
        objectName, 
        pdfFilePath,
        { 'Content-Type': 'application/pdf' }
      );
      
      // Get a presigned URL for the uploaded PDF
      const kq = await this.minioService.getPresignedUrl(
        BUCKET,
        objectName,
        604800  // URL valid for 7 days
      );
      
      // Clean up temporary files
      
      await kafkaService.sendMessage(topic, kq.toString());
      await this.cleanupFiles(downloadedFilePath, pdfFilePath);
    } catch (error) {
      this.logger.error("❌ Error during conversion or upload:", error.message);
      throw new HttpException(
        `Failed to convert or upload PDF: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  private async cleanupFiles(...filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
        this.logger.log(`Deleted temporary file: ${filePath}`);
      } catch (error) {
        this.logger.warn(`Error deleting file ${filePath}: ${error.message}`);
      }
    }
  }
  
  private async downloadFile(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.open(destination, 'w');
      
      const request = url.startsWith('https') ? https.get(url) : http.get(url);
      
      request.on('response', (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
          return;
        }

        const contentType = response.headers['content-type'];
        if (contentType && !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          this.logger.warn(`File may not be a DOCX document. Content-Type: ${contentType}`);
        }

        file.then(fileHandle => {
          const writeStream = fileHandle.createWriteStream();
          
          response.pipe(writeStream);
          
          writeStream.on('finish', () => {
            fileHandle.close().then(() => resolve());
          });
          
          writeStream.on('error', (err) => {
            fileHandle.close().then(() => reject(err));
          });
        });
      });
      
      request.on('error', (err) => {
        reject(err);
      });
      
      request.end();
    });
  }
}

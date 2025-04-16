import { 
  Controller, 
  Post, 
  Logger,
  HttpException,
  HttpStatus,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';
import { Multer } from 'multer';
import { ConvertService } from './convert.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConvertOptionsDto } from './dto/convert-options.dto';
import { ConvertUrlDto } from './dto/convert-url.dto';
import { join } from 'path';
import { promises as fs } from 'fs';

@ApiTags('Convert')
@Controller('convert')
export class ConvertController {
  private readonly logger = new Logger(ConvertController.name);

  constructor(private readonly convertService: ConvertService) {}

  @Post('pdf')
  async convertToPdf(
    @Body() convertUrlDto: ConvertUrlDto
  ) {
    try {
      this.logger.log(`Converting file docx from URL to PDF: ${convertUrlDto.url}`);
      const pdfUrl = await this.convertService.convertDocxToPDF(convertUrlDto.url);
      
      return { 
        url: pdfUrl,
        message: 'File successfully converted and uploaded',
        success: true
      };
    } catch (error) {
      this.logger.error(`Error in PDF conversion from URL: ${error.message}`);
      throw new HttpException(
        {
          message: `Error converting file to PDF: ${error.message}`,
          success: false
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class ConvertUrlDto {
  @ApiProperty({ 
    description: 'URL of the DOCX file to convert',
    example: 'https://example.com/document.docx'
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ 
    description: 'Whether to use inline styles instead of CSS classes in HTML output',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  inlineStyles?: boolean;
}

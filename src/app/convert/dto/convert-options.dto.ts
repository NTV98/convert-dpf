import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ConvertOptionsDto {
  @ApiProperty({ 
    description: 'Whether to use inline styles instead of CSS classes in HTML output',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  inlineStyles?: boolean;
}

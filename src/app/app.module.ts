import { Module } from '@nestjs/common';
import { ConvertModule } from './convert/convert.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    ConvertModule,
    MinioModule
  ],
})
export class AppModule {}
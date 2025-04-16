import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConvertController } from './convert.controller';
import { ConvertService } from './convert.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './temp',
    }),
    MinioModule,
  ],
  controllers: [ConvertController],
  providers: [ConvertService],
  exports: [ConvertService],
})
export class ConvertModule {}

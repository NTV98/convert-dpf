import { KafkaModule } from '@broker/kafka.module';
import { Module } from '@nestjs/common';
import { ConvertModule } from '../app/convert/convert.module';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [KafkaModule.register(), ConvertModule],
  providers: [ConsumerService],
})
export class ConsumerModule { }

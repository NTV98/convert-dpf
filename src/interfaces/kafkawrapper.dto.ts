import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class KafkaWrapper {
  @IsString()
  @IsNotEmpty()
  messageID: string;
  @IsString()
  @IsNotEmpty()
  projectName: string;
  @IsOptional()
  createdDate?: moment.Moment = moment();
  @IsString()
  @IsNotEmpty()
  message: string;
}

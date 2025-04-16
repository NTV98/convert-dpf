import { AbstractKafkaConsumer } from '@broker/kafka.abstract.consumer';
import { SubscribeToFixedGroup } from '@broker/kafka.decorator';
import { KafkaService } from '@broker/kafka.service';
import { codeMyDP247, kafka, projectName } from '@const';
import { KafkaWrapper } from '@interface/kafkawrapper.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConvertService } from '../app/convert/convert.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly convertService: ConvertService
  ) {
    super();
  }

  private readonly logger = new Logger(ConsumerService.name);

  protected registerTopic() {
    this.addTopic(kafka.topics.formatdocxTopdf);
    this.addTopic(kafka.topics.formatHTMLTopdf);
   

  }
  
  @SubscribeToFixedGroup(kafka.topics.formatdocxTopdf)
  async handleDocumentConversionRequests(message: string): Promise<void> {
    try {
      debugger
      const data = JSON.parse(message);
      this.logger.log(`Received document conversion request: ${JSON.stringify(data)}`);
      
      // Check if message contains a document URL to convert
      if (data.url) {
        this.logger.log(`Converting document from URL: ${data.url}`);
        
        const pdfUrl = await this.convertService.convertDocxToPDFKafka(data.url, kafka.topics.handledocxTopdf, this.kafkaService);
        
        // Send response back with URL to another Kafka topic if needed
        if (data.responseTopicId) {
          const response = {
            messageID: uuidv4(),
            projectName: projectName,
            originalRequest: data,
            pdfUrl: pdfUrl,
            success: true
          };
          
          
          this.logger.log(`Sent conversion result to ${data.responseTopicId}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
    }
  }
}

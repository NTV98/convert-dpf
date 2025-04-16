import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaConfig } from './kafka.message';
import { kafka, vaultConfig } from '@const';
import * as vault from 'node-vault';

@Global()
@Module({})
export class KafkaModule {
  static async register(): Promise<DynamicModule> {
    //get Vault
    const vaultServer = vault(vaultConfig);
    const v = await vaultServer.read('kv/data/kafka');
    kafka.username = v.data.data.username;
    kafka.password = v.data.data.password;

    const kaf: KafkaConfig = {
      clientId: 'notificationServer',
      brokers: kafka.broker.split(','),
      groupId: 'notification-group',
      ssl: false,
      sasl: {
        mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
        username: kafka.username,
        password: kafka.password,
      },
    };
    return {
      global: true,
      module: KafkaModule,
      providers: [
        {
          provide: KafkaService,
          useValue: new KafkaService(kaf),
        },
      ],
      exports: [KafkaService],
    };
  }
}

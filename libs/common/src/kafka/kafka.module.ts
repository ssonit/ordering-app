import { DynamicModule, Module } from '@nestjs/common'
import { KafkaService } from './kafka.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

interface KafkaModuleOptions {
  name: string
  clientId: string
  groupId: string
}

@Module({
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {
  static register({ name, clientId, groupId }: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId,
                  brokers: [configService?.get<string>('KAFKA_BROKER') || 'localhost:9092']
                },
                consumer: {
                  groupId
                }
              }
            }),
            inject: [ConfigService]
          }
        ])
      ]
    }
  }
}

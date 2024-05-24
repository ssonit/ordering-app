import { DynamicModule, Module } from '@nestjs/common'
import { KafkaService } from './kafka.service'
import { ClientsModule, Transport } from '@nestjs/microservices'

interface KafkaModuleOptions {
  name: string
}

@Module({
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {
  static register({ name }: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: () => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'auth',
                  brokers: ['localhost:9092']
                },
                consumer: {
                  groupId: 'auth-consumer'
                }
              }
            })
          }
        ])
      ]
    }
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'

@Injectable()
export class KafkaService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(consumer: string) {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092']
        },
        consumer: {
          groupId: consumer
        }
      }
    }
  }
}

import { NestFactory } from '@nestjs/core'
import { OrderModule } from './order.module'
import { KafkaService } from '@app/common'
import { KafkaOptions } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(OrderModule)
  const kafkaService = app.get(KafkaService)
  app.connectMicroservice<KafkaOptions>(kafkaService.getOptions('order-consumer'))
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices()
}
bootstrap()

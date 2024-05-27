import { NestFactory } from '@nestjs/core'
import { PaymentModule } from './payment.module'
import { KafkaOptions } from '@nestjs/microservices'
import { KafkaService } from '@app/common'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule)
  const kafkaService = app.get(KafkaService)
  app.connectMicroservice<KafkaOptions>(kafkaService.getOptions('payment-consumer'))
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices()
}
bootstrap()

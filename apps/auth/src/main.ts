import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { KafkaOptions } from '@nestjs/microservices'
import { KafkaService } from '@app/common'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const kafkaService = app.get(KafkaService)
  app.connectMicroservice<KafkaOptions>(kafkaService.getOptions('auth-consumer'))
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices()
}
bootstrap()

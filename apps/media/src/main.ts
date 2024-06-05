import { NestFactory } from '@nestjs/core'
import { MediaModule } from './media.module'
import { KafkaService } from '@app/common'
import { KafkaOptions } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(MediaModule)
  const kafkaService = app.get(KafkaService)
  app.connectMicroservice<KafkaOptions>(kafkaService.getOptions('media-consumer'))
  app.useGlobalPipes(new ValidationPipe())
  await app.startAllMicroservices()
  await app.listen(3001)
}
bootstrap()

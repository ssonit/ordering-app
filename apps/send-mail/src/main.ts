import { NestFactory } from '@nestjs/core'
import { SendMailModule } from './send-mail.module'

async function bootstrap() {
  const app = await NestFactory.create(SendMailModule)
  await app.listen(3002)
}
bootstrap()

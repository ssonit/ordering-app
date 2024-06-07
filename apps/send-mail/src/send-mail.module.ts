import { Module } from '@nestjs/common'
import { SendMailController } from './send-mail.controller'
import { SendMailService } from './send-mail.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SESClient } from '@aws-sdk/client-ses'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [SendMailController],
  providers: [
    SendMailService,
    {
      provide: SESClient,
      useFactory: (configService: ConfigService) => {
        const sesClient = new SESClient({
          region: configService.getOrThrow('AWS_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY'),
            secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
          }
        })
        return sesClient
      },
      inject: [ConfigService]
    }
  ]
})
export class SendMailModule {}

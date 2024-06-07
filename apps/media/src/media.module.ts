import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KafkaModule } from '@app/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { S3Client } from '@aws-sdk/client-s3'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: 60,
          limit: 10
        }
      ]
    })
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        const s3Client = new S3Client({
          region: configService.getOrThrow('AWS_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY'),
            secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
          }
        })
        return s3Client
      },
      inject: [ConfigService]
    }
  ]
})
export class MediaModule {}

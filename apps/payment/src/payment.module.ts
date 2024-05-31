import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { KafkaModule } from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        const stripe = new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'), {
          apiVersion: '2024-04-10',
          typescript: true
        })
        return stripe
      },
      inject: [ConfigService]
    }
  ]
})
export class PaymentModule {}

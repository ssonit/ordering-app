import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { DatabaseModule, KafkaModule } from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PaymentRepository } from './payment.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Payment, PaymentSchema } from './schemas/payment.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
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

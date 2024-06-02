import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { DatabaseModule, KafkaModule, ORDER_SERVICE } from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PaymentRepository } from './payment.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Payment, PaymentSchema } from './schemas/payment.schema'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'order-consumer'
          }
        }
      }
    ])
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

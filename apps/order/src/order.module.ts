import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { Order, OrderSchema } from './schemas/order.schema'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule, KafkaModule } from '@app/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderRepository } from './order.repository'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    KafkaModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository]
})
export class OrderModule {}

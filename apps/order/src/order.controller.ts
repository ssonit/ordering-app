import { Controller, Get } from '@nestjs/common'
import { OrderService } from './order.service'
import { EventPattern, Payload } from '@nestjs/microservices'

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello()
  }

  @EventPattern('created_order')
  async handleOrderCreated(@Payload() data: any) {
    return this.orderService.handleOrderCreated(data)
  }
}

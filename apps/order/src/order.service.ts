import { Injectable } from '@nestjs/common'
import { OrderRepository } from './order.repository'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  getHello(): string {
    return 'Hello World!'
  }

  async handleOrderCreated(data: any) {
    await this.orderRepository.create(data)
  }
}

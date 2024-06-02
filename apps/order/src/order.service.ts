import { Injectable } from '@nestjs/common'
import { OrderRepository } from './order.repository'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  getHello(): string {
    return 'Hello World!'
  }

  async handleOrderCreated(data: any) {
    const products = data.product.map((item: any) => ({
      user: data.userId,
      product: item.id,
      quantity: item.quantity,
      status: 'pending'
    }))

    await this.orderRepository.createMany(products)
  }
}

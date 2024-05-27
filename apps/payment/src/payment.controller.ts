import { Controller, Get } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { EventPattern, Payload } from '@nestjs/microservices'

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello()
  }

  @EventPattern('created_payment')
  async handlePaymentCreated(@Payload() data: any) {
    console.log(data)
  }
}

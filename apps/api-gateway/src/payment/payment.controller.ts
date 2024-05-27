import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  makePayment() {
    return this.paymentService.makePayment()
  }
}

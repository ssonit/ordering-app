import { Controller, Get } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { NewResponseError, NewResponseSuccess } from '@app/common'

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello()
  }

  @MessagePattern('created_payment')
  async handlePaymentCreated(@Payload() data: any) {
    try {
      const result = await this.paymentService.handlePaymentCreated(data)
      return NewResponseSuccess(result)
    } catch (error) {
      return NewResponseError(error)
    }
  }
}

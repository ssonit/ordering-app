import { Controller, Get } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { NewFullCustomResponse } from '@app/common'

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
      const { body, user } = data
      const result = await this.paymentService.handlePaymentCreated({
        data: body.product,
        user
      })
      return NewFullCustomResponse(result, null, 'Created payment successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'An error occurred')
    }
  }

  @EventPattern('stripe_webhook')
  async stripeWebhook(@Payload() data: any) {
    try {
      await this.paymentService.stripeWebhook(data.body, data.headers)
    } catch (error) {
      return NewFullCustomResponse(null, error, 'An error occurred')
    }
  }
}

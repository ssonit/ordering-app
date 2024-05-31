import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka) {}

  async makePayment() {
    return this.paymentClient.send('created_payment', JSON.stringify({ id: '123' }))
  }

  async stripeWebhook(body: any, headers: any) {
    this.paymentClient.emit(
      'stripe_webhook',
      JSON.stringify({
        body,
        headers
      })
    )
  }
}

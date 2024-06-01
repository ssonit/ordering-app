import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka) {}

  async makePayment(body: any, user: any) {
    return this.paymentClient.send(
      'created_payment',
      JSON.stringify({
        body,
        user
      })
    )
  }

  stripeWebhook(body: any, stripeSignature: string) {
    this.paymentClient.emit(
      'stripe_webhook',
      JSON.stringify({
        body,
        stripeSignature
      })
    )
    return true
  }
}

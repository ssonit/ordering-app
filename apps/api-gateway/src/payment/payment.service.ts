import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka) {}

  async makePayment() {
    try {
      this.paymentClient.emit('created_payment', JSON.stringify({ id: '123' }))

      return { message: 'Payment created' }
    } catch (error) {
      console.log(error)
    }
  }
}

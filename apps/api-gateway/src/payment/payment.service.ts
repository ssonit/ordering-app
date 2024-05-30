import { NewCustomErrorResponse, NewFullCustomResponse } from '@app/common'
import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka) {}

  async makePayment() {
    try {
      const response = this.paymentClient.send('created_payment', JSON.stringify({ id: '123' }))
      const result = await lastValueFrom(response)

      if (result.error) {
        return NewCustomErrorResponse(result.error)
      }

      return NewFullCustomResponse(result.data, null, 'Create payment successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'Error client kafka')
    }
  }
}

import { Controller, HttpCode, HttpStatus, Inject, OnModuleInit, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { ClientKafka } from '@nestjs/microservices'

@Controller('payment')
export class PaymentController implements OnModuleInit {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  makePayment() {
    return this.paymentService.makePayment()
  }

  async onModuleInit() {
    this.paymentClient.subscribeToResponseOf('created_payment')

    await this.paymentClient.connect()
  }
}

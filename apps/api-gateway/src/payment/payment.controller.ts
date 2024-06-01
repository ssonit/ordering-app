import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PAYMENT_SERVICE } from '@app/common/constants/services'
import { ClientKafka } from '@nestjs/microservices'
import { JwtAuthGuard } from '@app/common'

@Controller('payment')
export class PaymentController implements OnModuleInit {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  makePayment(@Body() body: any, @Req() req: any) {
    return this.paymentService.makePayment(body, req.user)
  }

  @Post('stripe/webhook')
  @HttpCode(HttpStatus.OK)
  stripeWebhook(@Req() req: any, @Headers() headers: any) {
    const body = Buffer.from(req.rawBody)
    const stripeSignature = headers['stripe-signature'] as string

    return this.paymentService.stripeWebhook(body, stripeSignature)
  }

  async onModuleInit() {
    this.paymentClient.subscribeToResponseOf('created_payment')

    await this.paymentClient.connect()
  }
}

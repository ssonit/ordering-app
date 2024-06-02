import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PaymentRepository } from './payment.repository'
import { ORDER_SERVICE } from '@app/common'
import { ClientKafka } from '@nestjs/microservices'

interface Product {
  name: string
  description: string
  images: string[]
  price: number
  quantity: number
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientKafka,
    private readonly configService: ConfigService,
    private stripe: Stripe,
    private paymentRepository: PaymentRepository
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  async handlePaymentCreated({ data, user }: { data: Product[]; user: any }) {
    try {
      const line_items = data.map((item: Product) => ({
        price_data: {
          currency: 'VND',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.images
          },
          unit_amount: item.price
        },
        quantity: item.quantity
      }))

      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        mode: 'payment',
        billing_address_collection: 'auto',
        line_items,
        metadata: {
          userId: user._id,
          data: JSON.stringify(data)
        }
      })
      return {
        url: session.url
      }
    } catch (error) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }

  async stripeWebhook(body: Buffer, signature: string) {
    const webhookSecret = this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET')
    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(Buffer.from(body), signature, webhookSecret)
    } catch (error) {
      throw new BadRequestException('Webhook Error')
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      const info = await this.stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items']
      })

      await this.createPayment({
        paymentId: session.id,
        amount: info.amount_total,
        currency: info.currency,
        status: 'success'
      })

      this.orderClient.emit(
        'created_order',
        JSON.stringify({
          userId: info.metadata.userId,
          product: info.line_items.data
        })
      )

      // Create payment database
      // Create order database
    }
    return true
  }

  async createPayment(body: any) {
    await this.paymentRepository.create({
      paymentId: body.paymentId,
      amount: body.amount,
      status: body.status,
      currency: body.currency
    })
  }
}

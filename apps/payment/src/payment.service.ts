import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PaymentRepository } from './payment.repository'

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
          userId: user._id
        }
      })
      return {
        url: session.url
      }
    } catch (error) {
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
      const info = await this.stripe.checkout.sessions.retrieve(session.id)

      await this.createPayment({
        paymentId: session.id,
        amount: info.amount_total
      })

      // Create payment database
      // Create order database
    }
    return true
  }

  async createPayment(body: any) {
    const date = new Date()
    await this.paymentRepository.create({
      paymentId: body.paymentId,
      amount: body.amount,
      status: 'success',
      currency: 'VND',
      createdPaymentAt: date
    })
  }
}

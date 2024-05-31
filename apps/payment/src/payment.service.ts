import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripe: Stripe
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  async handlePaymentCreated(data: any, user: any) {
    console.log({ data })
    try {
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        mode: 'payment',
        billing_address_collection: 'auto',
        line_items: [
          {
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt'
              },
              unit_amount: 10_000
            },
            quantity: 1
          }
        ],
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

  async stripeWebhook(body: any, headers: any) {
    const signature = headers['stripe-signature'] as string
    console.log(body, signature)
    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET')
    )

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      console.log(session)
      // Create payment database
      // Create order database
    }

    return
  }
}

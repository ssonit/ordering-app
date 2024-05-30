import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'

@Injectable()
export class PaymentService {
  constructor(private readonly stripe: Stripe) {}

  getHello(): string {
    return 'Hello World!'
  }

  async handlePaymentCreated(data: any) {
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
        ]
      })
      return session
    } catch (error) {
      throw new Error(error)
    }
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false, timestamps: true })
export class Payment extends AbstractDocument {
  @Prop({ required: true })
  paymentId: string

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  status: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)

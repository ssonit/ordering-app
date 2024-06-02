import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false, timestamps: true })
export class Order extends AbstractDocument {
  @Prop({ required: true })
  user: string

  @Prop({ required: true })
  product: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  status: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)

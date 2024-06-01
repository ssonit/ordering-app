import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '@app/common'

@Schema({ versionKey: false, timestamps: true })
export class Order extends AbstractDocument {
  @Prop({ required: true })
  user: string

  @Prop({ required: true })
  product: Product

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  status: string
}

class Product {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  images: string[]

  @Prop({ required: true })
  price: number
}

export const OrderSchema = SchemaFactory.createForClass(Order)

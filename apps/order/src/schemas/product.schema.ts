import { AbstractDocument } from '@app/common'
import { Prop, SchemaFactory } from '@nestjs/mongoose'

export class Product extends AbstractDocument {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  images: string[]

  @Prop({ required: true })
  price: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)

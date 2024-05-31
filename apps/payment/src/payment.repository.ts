import { Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Model, Connection } from 'mongoose'
import { AbstractRepository } from '@app/common'
import { Payment } from './schemas/payment.schema'

@Injectable()
export class PaymentRepository extends AbstractRepository<Payment> {
  protected readonly logger = new Logger(PaymentRepository.name)

  constructor(@InjectModel(Payment.name) paymentModel: Model<Payment>, @InjectConnection() connection: Connection) {
    super(paymentModel, connection)
  }
}

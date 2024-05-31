import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { PaymentModule } from './payment/payment.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    PaymentModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

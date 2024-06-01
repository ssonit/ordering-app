import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { PaymentModule } from './payment/payment.module'
import { ConfigModule } from '@nestjs/config'
import { JsonBodyMiddleware, RawBodyMiddleware } from '@app/common'

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
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/payment/stripe/webhook',
        method: RequestMethod.POST
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { AUTH_SERVICE } from '../constants/services'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'auth-consumer'
          }
        }
      }
    ])
  ],
  exports: []
})
export class AuthModuleCommon implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*')
  }
}

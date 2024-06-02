import { CreateUserDto } from '@app/common'
import { AUTH_SERVICE } from '@app/common'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientKafka) {}

  async login(data: CreateUserDto) {
    return this.authClient.send('login', JSON.stringify(data))
  }

  async register(data: CreateUserDto) {
    return this.authClient.send('register', JSON.stringify(data))
  }

  async getUser(id: string) {
    return this.authClient.send('get_user', JSON.stringify({ id }))
  }
}

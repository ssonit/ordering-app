import { CreateUserDto, NewCustomErrorResponse, NewFullCustomResponse } from '@app/common'
import { AUTH_SERVICE } from '@app/common/constants/services'
import { Inject, Injectable } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientKafka) {}

  async login(data: CreateUserDto) {
    try {
      const response = this.authClient.send('login', JSON.stringify(data))
      const result = await lastValueFrom(response)

      if (result.error) {
        return NewCustomErrorResponse(result.error)
      }

      return NewFullCustomResponse(result.data, null, 'Login successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'Error client kafka')
    }
  }

  async register(data: CreateUserDto) {
    try {
      const response = this.authClient.send('register', JSON.stringify(data))
      const result = await lastValueFrom(response)

      if (result.error) {
        return NewCustomErrorResponse(result.error)
      }

      return NewFullCustomResponse(result.data, null, 'Register successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'Error client kafka')
    }
  }

  async getUser(id: string) {
    try {
      const response = this.authClient.send('get_user', JSON.stringify({ id }))
      const result = await lastValueFrom(response)

      console.log(result, 'result')

      if (result.error) {
        return NewCustomErrorResponse(result.error)
      }

      return NewFullCustomResponse(result.data, null, 'Get user successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'Error client kafka')
    }
  }
}

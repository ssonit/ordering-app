import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateUserDto, CurrentUser, NewResponseError, NewResponseSuccess } from '@app/common'
import JwtAuthGuard from './guards/jwt-auth.guard'
import { User } from './users/schemas/user.schema'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello()
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user
  }

  @MessagePattern('register')
  async handleUserCreate(@Payload() data: CreateUserDto) {
    try {
      const result = await this.authService.createUser(data)
      return NewResponseSuccess(result)
    } catch (error) {
      return NewResponseError(error)
    }
  }

  @MessagePattern('login')
  async handleLogin(@Payload() data: CreateUserDto) {
    try {
      const result = await this.authService.login(data)
      return NewResponseSuccess(result)
    } catch (error) {
      return NewResponseError(error)
    }
  }

  @MessagePattern('get_user')
  async handleGetUser(@Payload() data: { id: string }) {
    try {
      const result = await this.authService.getUser(data.id)
      return NewResponseSuccess(result)
    } catch (error) {
      return NewResponseError(error)
    }
  }
}

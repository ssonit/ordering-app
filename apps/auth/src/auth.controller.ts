import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateUserDto, CurrentUser, NewFullCustomResponse } from '@app/common'
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
    try {
      return user
    } catch (error) {
      return error
    }
  }

  @MessagePattern('register')
  async handleUserCreate(@Payload() data: CreateUserDto) {
    try {
      const result = await this.authService.createUser(data)
      return NewFullCustomResponse(result, null, 'Register successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'An error occurred')
    }
  }

  @MessagePattern('login')
  async handleLogin(@Payload() data: CreateUserDto) {
    try {
      const result = await this.authService.login(data)
      return NewFullCustomResponse(result, null, 'Login successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'An error occurred')
    }
  }

  @MessagePattern('get_user')
  async handleGetUser(@Payload() data: { id: string }) {
    try {
      const result = await this.authService.getUser(data.id)
      return NewFullCustomResponse(result, null, 'Get user successfully')
    } catch (error) {
      return NewFullCustomResponse(null, error, 'An error occurred')
    }
  }
}

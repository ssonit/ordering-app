import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateUserDto, CurrentUser, NewCustomErrorResponse } from '@app/common'
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
      return NewCustomErrorResponse(result, null)
    } catch (error) {
      return NewCustomErrorResponse(null, error)
    }
  }

  @MessagePattern('login')
  handleLogin(@Payload() data: CreateUserDto) {
    return this.authService.login(data)
  }

  @MessagePattern('get_user')
  handleGetUser(@Payload() data: { id: string }) {
    return this.authService.getUser(data.id)
  }
}

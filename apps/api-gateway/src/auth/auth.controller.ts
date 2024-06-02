import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ClientKafka } from '@nestjs/microservices'
import { AUTH_SERVICE } from '@app/common'
import { CreateUserDto, JwtAuthGuard } from '@app/common'

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafka
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: CreateUserDto) {
    return this.authService.login(data)
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data)
  }

  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string, @Req() req: any) {
    console.log(req.user, 'user')
    return this.authService.getUser(id)
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('login')
    this.authClient.subscribeToResponseOf('register')
    this.authClient.subscribeToResponseOf('get_user')
    this.authClient.subscribeToResponseOf('validate_user')
    await this.authClient.connect()
  }
}

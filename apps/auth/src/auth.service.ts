import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from './users/users.service'
import { Types } from 'mongoose'
import { CreateUserDto } from '@app/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

export interface TokenPayload {
  user_id: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  getHello(): string {
    return 'Hello World!'
  }

  createUser(data: CreateUserDto) {
    return this.usersService.createUser(data)
  }

  async login(data: CreateUserDto) {
    const user = await this.usersService.validateUser(data.email, data.password)

    const tokenPayload: TokenPayload = {
      user_id: user._id.toHexString()
    }

    const token = this.jwtService.sign(tokenPayload)

    return {
      user,
      token
    }
  }

  getUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Id is not valid')
    }
    const user = this.usersService.getUser({ _id: new Types.ObjectId(id) })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }
}

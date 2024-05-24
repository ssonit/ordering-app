import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from './users.repository'
import { User } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserDto) {
    await this.validateCreateUserDto(request)
    const user = await this.usersRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10)
    })
    return {
      _id: user._id
    }
  }

  private async validateCreateUserDto(request: CreateUserDto) {
    let user: User
    try {
      user = await this.usersRepository.findOne({
        email: request.email
      })
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.')
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email })
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    return user
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.usersRepository.findOne(getUserArgs)
  }
}

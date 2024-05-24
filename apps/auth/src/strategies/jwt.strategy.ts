import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Types } from 'mongoose'
import { TokenPayload } from '../auth.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const token = request?.Authentication.split(' ')[1]
          return token
        }
      ]),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({ user_id }: TokenPayload) {
    try {
      return await this.usersService.getUser({
        _id: new Types.ObjectId(user_id)
      })
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}

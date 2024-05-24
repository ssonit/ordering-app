import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, catchError, tap } from 'rxjs'
import { AUTH_SERVICE } from '../constants/services'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context)

    return this.authClient
      .send('validate_user', {
        Authentication: authentication
      })
      .pipe(
        tap((res) => {
          this.addUser(res, context)
        }),
        catchError((error) => {
          console.log(error, 'error')
          throw new UnauthorizedException("Can't access this resource")
        })
      )
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication
    } else if (context.getType() === 'http') {
      authentication =
        context.switchToHttp().getRequest().cookies?.Authentication ||
        context.switchToHttp().getRequest().headers['authorization']
    }

    if (!authentication) {
      throw new UnauthorizedException('Authentication token not found')
    }

    return authentication
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user
    }
  }
}

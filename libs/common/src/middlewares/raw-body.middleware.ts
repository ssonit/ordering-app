import { Injectable, NestMiddleware } from '@nestjs/common'
import * as bodyParser from 'body-parser'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (err?: any) => void) {
    bodyParser.raw({ type: 'application/json' })(req, res, (err: any) => {
      if (err) {
        return next(err)
      }
      req.rawBody = req.body
      next()
    })
  }
}

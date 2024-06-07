import { Controller, Get, Post } from '@nestjs/common'
import { SendMailService } from './send-mail.service'
import * as path from 'path'
import * as fs from 'fs'

@Controller('send-mail')
export class SendMailController {
  constructor(private readonly sendMailService: SendMailService) {}

  @Get()
  getHello(): string {
    return this.sendMailService.getHello()
  }

  @Post()
  sendMail() {
    const pathVerifyEmailTemplate = path.resolve('apps/send-mail/src/templates/verify-email.html')
    const verifyEmailTemplate = fs.readFileSync(pathVerifyEmailTemplate, 'utf8')
    function replaceTemplate(template: string, replacements: { [key: string]: string }) {
      return template.replace(/{{(.*?)}}/g, (match, key) => replacements[key.trim()] || match)
    }

    return this.sendMailService.sendVerifyEmail(
      'son.0919835876@gmail.com',
      'Verify Email',
      replaceTemplate(verifyEmailTemplate, {
        title: 'Please verify your email',
        content: 'Click here to verify your email',
        link: `http://localhost:3000/verify-email?token=123456`,
        titleLink: 'Verify'
      })
    )
  }
}

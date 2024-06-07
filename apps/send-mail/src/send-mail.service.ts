import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SendMailService {
  constructor(private readonly sesClient: SESClient) {}

  getHello(): string {
    return 'Hello World!'
  }

  private createSendEmailCommand({
    fromAddress,
    toAddresses,
    ccAddresses = [],
    body,
    subject,
    replyToAddresses = []
  }: {
    fromAddress: string
    toAddresses: string | string[]
    ccAddresses?: string[]
    body: any
    subject: string
    replyToAddresses?: string[]
  }) {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
        ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: body
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      Source: fromAddress,
      ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
    })
  }

  async sendVerifyEmail(toAddress: string, subject: string, body: any) {
    const sendEmailCommand = this.createSendEmailCommand({
      fromAddress: process.env.SES_FROM_ADDRESS,
      toAddresses: toAddress,
      body,
      subject
    })

    try {
      return await this.sesClient.send(sendEmailCommand)
    } catch (e) {
      console.error('Failed to send email.')
      return e
    }
  }
}

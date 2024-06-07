import { Test, TestingModule } from '@nestjs/testing'
import { SendMailController } from './send-mail.controller'
import { SendMailService } from './send-mail.service'

describe('SendMailController', () => {
  let sendMailController: SendMailController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SendMailController],
      providers: [SendMailService]
    }).compile()

    sendMailController = app.get<SendMailController>(SendMailController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sendMailController.getHello()).toBe('Hello World!')
    })
  })
})

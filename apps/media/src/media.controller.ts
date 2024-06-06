import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { MediaService } from './media.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImageFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadImageFile(file)
  }

  @Get('image/:name')
  sendImageFile(@Param('name') name: string) {
    return this.mediaService.sendFileFromS3('images/' + name)
  }
}

import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MediaService {
  // private readonly s3Client = new S3Client({
  //   region: this.configService.getOrThrow('AWS_S3_REGION'),
  //   credentials: {
  //     accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
  //     secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
  //   }
  // })
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: 'nestjs-microservices-ap-southeast',
        Key: file.originalname,
        Body: file.buffer
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false
    })
    console.log(parallelUploads3)
  }
}

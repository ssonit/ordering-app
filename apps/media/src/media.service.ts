import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'

export enum MediaType {
  Image,
  Video,
  HLS
}

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client
  ) {}

  private get s3BucketName() {
    return 'nestjs-microservices-ap-southeast'
  }

  private get s3BucketRegion() {
    return this.configService.getOrThrow('AWS_S3_REGION')
  }

  private randomObjectKeyName(name: string) {
    const newName = name.replace(/\s/g, '-')
    const splitName = newName.split('.')
    const sliceName = splitName.slice(0, -1)

    sliceName.push(randomUUID())

    name = `${sliceName.join('-')}.${splitName[splitName.length - 1]}`
    return name
  }

  private getObjectURL(name: string) {
    return `https://${this.s3BucketName}.s3.${this.s3BucketRegion}.amazonaws.com/${name}`
  }

  async uploadImageFile(file: Express.Multer.File) {
    const objectName = this.randomObjectKeyName(file.originalname)
    const parallelUploads3 = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.s3BucketName,
        Key: 'images/' + objectName,
        Body: file.buffer,
        ContentType: file.mimetype
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false
    })
    const s3Result = await parallelUploads3.done()

    return {
      url: s3Result.Location,
      type: MediaType.Image
    }
  }

  async sendFileFromS3(name: string) {
    const command = new GetObjectCommand({
      Bucket: this.s3BucketName,
      Key: name
    })

    try {
      const response = await this.s3Client.send(command)
      const str = response.Body.transformToString()
      return str
    } catch (error) {
      throw new NotFoundException('File not found')
    }
  }
}

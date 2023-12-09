import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  async upload(file, originalname) {
    const bucketS3 = process.env.AWS_S3_BUCKET_NAME;
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    try {
      const s3 = this.getS3();
      const params = {
        Bucket: bucket,
        Key: String(name),
        Body: file,
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            Logger.error(err);
            reject(err.message);
          }
          resolve(data);
          return name;
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}

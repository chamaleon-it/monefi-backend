import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
     handleFile(file: Express.Multer.File) {
if(!file) throw new BadRequestException("File not found.")
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  }
}

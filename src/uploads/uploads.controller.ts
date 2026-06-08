import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    const { filename } = this.uploadsService.handleFile(file);
    return {
      data: `/uploads/${filename}`,
      message: 'The file has been uploaded successfully.',
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload2(@UploadedFile() file: Express.Multer.File) {
    const { filename } = this.uploadsService.handleFile(file);
    return {
      data: `/uploads/${filename}`,
      message: 'The file has been uploaded successfully.',
    };
  }
}

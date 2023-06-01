import {
  Controller,
  Res,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    await this.appService.uploadImage(file);
    return 'uploaded';
  }

  @Get('read-imagem')
  @Header('Content-Type', 'image/webp')
  async read(@Res() response: Response, @Query('name') name: string) {
    // http://localhost:8080/read-image?name=bike-4.wepb
    const data = await this.appService.readStream(name);
    return data.pipe(response);
  }

  @Get('download-imagem')
  @Header('Content-Type', 'image/webp')
  @Header('Content-Disposition', 'attachment; filename=test.webp')
  async download(@Res() response: Response, @Query('name') name: string) {
    // http://localhost:8080/download-image?name=bike-4.wepb
    const data = await this.appService.readStream(name);
    return data.pipe(response);
  }

  @Get('delete-imagem')
  async deleteImage(@Query('name') name: string) {
    // http://localhost:8080/delete-image?name=bike-4.wepb
    await this.appService.delete(name);
    return 'deleted';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

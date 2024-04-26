import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('File uploaded successfully.')
  @UseInterceptors(FilesInterceptor('filesUpload'))
  uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    // new ParseFilePipeBuilder()
    //   .addFileTypeValidator({
    //     fileType:
    //       /^(jpg|jpeg|image\/jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|text\/plain)$/i,
    //   })
    //   .addMaxSizeValidator({
    //     maxSize: 1024 * 1024 * 1024,
    //   })
    //   .build({
    //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    //   }),
  ) {
    return {
      // files,
      fileNames: files.map((file) => file.filename),
    };
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}

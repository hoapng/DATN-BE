import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  @ResponseMessage('Create hashtag successfully')
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagService.create(createHashtagDto);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all hashtags successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.hashtagService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get('/top')
  @ResponseMessage('Get all hashtags successfully with pagination')
  findTop(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.hashtagService.findTop(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashtagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashtagDto: UpdateHashtagDto) {
    return this.hashtagService.update(+id, updateHashtagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashtagService.remove(+id);
  }
}

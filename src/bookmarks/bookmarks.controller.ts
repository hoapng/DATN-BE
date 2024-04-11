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
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ResponseMessage('Create bookmark successfully')
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @UserDecor() user: IUser,
  ) {
    return this.bookmarksService.create(createBookmarkDto, user);
  }

  @Get()
  @ResponseMessage('Get all users successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.bookmarksService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(+id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.bookmarksService.remove(id, user);
  }
}

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
import { BadwordsService } from './badwords.service';
import { CreateBadwordDto } from './dto/create-badword.dto';
import { UpdateBadwordDto } from './dto/update-badword.dto';
import { Public, ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('badwords')
export class BadwordsController {
  constructor(private readonly badwordsService: BadwordsService) {}

  @Post()
  @ResponseMessage('Create bad word successfully')
  create(@Body() createBadwordDto: CreateBadwordDto, @UserDecor() user: IUser) {
    return this.badwordsService.create(createBadwordDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all users successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.badwordsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badwordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBadwordDto: UpdateBadwordDto) {
    return this.badwordsService.update(+id, updateBadwordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.badwordsService.remove(id, user);
  }
}

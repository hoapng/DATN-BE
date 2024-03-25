import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Public, ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @ResponseMessage('Create tweet successfully')
  create(@Body() createTweetDto: CreateTweetDto, @UserDecor() user: IUser) {
    return this.tweetsService.create(createTweetDto, user);
  }

  @Get()
  findAll() {
    return this.tweetsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.tweetsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update tweet successfully')
  update(
    @Param('id') id: string,
    @Body() updateTweetDto: UpdateTweetDto,
    @UserDecor() user: IUser,
  ) {
    return this.tweetsService.update(id, updateTweetDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.tweetsService.remove(id, user);
  }
}

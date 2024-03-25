import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  @ResponseMessage('Create bookmark successfully')
  create(
    @Body() createFollowerDto: CreateFollowerDto,
    @UserDecor() user: IUser,
  ) {
    return this.followersService.create(createFollowerDto, user);
  }

  @Get()
  findAll() {
    return this.followersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFollowerDto: UpdateFollowerDto,
  ) {
    return this.followersService.update(+id, updateFollowerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.followersService.remove(id, user);
  }
}

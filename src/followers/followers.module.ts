import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from './entities/follower.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}

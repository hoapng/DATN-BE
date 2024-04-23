import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './entities/tweet.entity';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tweet.name,
        useFactory: () => {
          const schema = TweetSchema;
          schema.plugin(softDeletePlugin);
          return schema;
        },
      },
    ]),
    HashtagModule,
  ],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}

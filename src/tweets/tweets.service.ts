import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Tweet, TweetDocument } from './entities/tweet.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet.name)
    private tweetModel: SoftDeleteModel<TweetDocument>,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: IUser) {
    let tweet = await this.tweetModel.create({
      ...createTweetDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: tweet._id,
      createdAt: tweet?.createdAt,
    };
  }

  findAll() {
    return `This action returns all tweets`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found tweet';

    return this.tweetModel.findOne({ _id: id });
  }

  async update(id: string, updateTweetDto: UpdateTweetDto, user?: IUser) {
    return await this.tweetModel.updateOne(
      { _id: id },
      {
        ...updateTweetDto,
        // updatedBy: {
        //   _id: user._id,
        //   email: user.email,
        // },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found tweet';
    await this.tweetModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.tweetModel.softDelete({ _id: id });
  }
}

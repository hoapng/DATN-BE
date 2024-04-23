import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Tweet, TweetDocument } from './entities/tweet.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { HashtagService } from 'src/hashtag/hashtag.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet.name)
    private tweetModel: SoftDeleteModel<TweetDocument>,

    private hashtagService: HashtagService,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: IUser) {
    const [tweet] = await Promise.all([
      this.tweetModel.create({
        ...createTweetDto,
        createdBy: user._id,
      }),
      ...createTweetDto.hashtags.map((hashtag) =>
        this.hashtagService.create({ name: hashtag }),
      ),
    ]);

    // let tweet = await this.tweetModel.create({
    //   ...createTweetDto,
    //   createdBy: user._id,
    // });
    return {
      _id: tweet._id,
      createdAt: tweet?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.tweetModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.tweetModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
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
        deletedBy: user._id,
      },
    );
    return await this.tweetModel.softDelete({ _id: id });
  }
}

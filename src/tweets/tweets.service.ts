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
import ContentBasedRecommender, { Options } from 'content-based-recommender-ts';

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

  findOne(id: string, qs: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found tweet';
    const { filter, sort, projection, population } = aqp(qs);

    return this.tweetModel.findOne({ _id: id }).populate(population).exec();
  }

  async recommend(id: string, qs: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found tweet';
    const options: Options = {
      maxSimilarDocs: 5, // example value
      maxVectorSize: 100, // example value
      minScore: 0.01, // example value
      debug: true, // example value
    };
    const recommender = new ContentBasedRecommender(options);
    // prepare documents data

    const data = await this.findAll(1, 20, qs);

    const documents = data.result.filter((x) => x._id.toString() !== id);

    const posts = [await this.tweetModel.findOne({ _id: id }), ...documents];

    const transformDocuments = posts.map((document) => {
      return {
        id: document._id.toString(),
        content: document.title,
      };
    });

    // const documents = [
    //   { id: '1000001', content: 'Why studying javascript is fun?' },
    //   {
    //     id: '1000002',
    //     content: 'The trend for javascript in machine learning',
    //   },
    //   {
    //     id: '1000003',
    //     content: 'The most insightful stories about JavaScript',
    //   },
    //   { id: '1000004', content: 'Introduction to Machine Learning' },
    //   { id: '1000005', content: 'Machine learning and its application' },
    //   { id: '1000006', content: 'Python vs Javascript, which is better?' },
    //   { id: '1000007', content: 'How Python saved my life?' },
    //   { id: '1000008', content: 'The future of Bitcoin technology' },
    //   {
    //     id: '1000009',
    //     content: 'Is it possible to use javascript for machine learning?',
    //   },
    // ];

    // start training
    recommender.train(transformDocuments);

    //get top 10 similar items to document 1000002
    const similarDocuments = recommender
      .getSimilarDocuments(id, 0, 5)
      .map((x) => x.id);
    return {
      result: posts.filter((x) => similarDocuments.includes(x._id.toString())),
    };
  }

  async recommendFeeds() {}

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

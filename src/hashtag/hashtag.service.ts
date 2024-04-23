import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hashtag, HashtagDocument } from './entities/hashtag.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class HashtagService {
  constructor(
    @InjectModel(Hashtag.name)
    private hashtagModel: SoftDeleteModel<HashtagDocument>,
  ) {}

  async create(createHashtagDto: CreateHashtagDto) {
    let hashtag = await this.hashtagModel.create({
      ...createHashtagDto,
    });
    return {
      _id: hashtag._id,
      createdAt: hashtag?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.hashtagModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.hashtagModel
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

  async findTop(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    const { from, to } = filter;

    delete filter.current;
    delete filter.pageSize;
    delete filter.from;
    delete filter.to;
    // console.log(filter);

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (
      await this.hashtagModel.aggregate([
        {
          $match: {
            ...filter,
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $group: {
            _id: '$name',
            count: { $sum: 1 },
          },
        },
      ])
    ).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.hashtagModel
      .aggregate([
        {
          $match: {
            ...filter,
            createdAt: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        },
        {
          $group: {
            _id: '$name',
            count: { $sum: 1 },
          },
        },
      ])
      .skip(offset)
      .limit(defaultLimit)
      .sort('-count')
      // .populate(population)
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

  findOne(id: number) {
    return `This action returns a #${id} hashtag`;
  }

  update(id: number, updateHashtagDto: UpdateHashtagDto) {
    return `This action updates a #${id} hashtag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashtag`;
  }
}

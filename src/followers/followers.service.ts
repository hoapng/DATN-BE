import { Injectable } from '@nestjs/common';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from './entities/follower.entity';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class FollowersService {
  constructor(
    @InjectModel(Follower.name)
    private followerModel: Model<FollowerDocument>,
  ) {}

  async create(createFollowerDto: CreateFollowerDto, user: IUser) {
    let follower = await this.followerModel.create({
      ...createFollowerDto,
      createdBy: user._id,
    });
    return {
      _id: follower._id,
      createdAt: follower?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.followerModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.followerModel
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

  findOne(id: number) {
    return `This action returns a #${id} follower`;
  }

  update(id: number, updateFollowerDto: UpdateFollowerDto) {
    return `This action updates a #${id} follower`;
  }

  async remove(id: string, user?: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found follower';
    return await this.followerModel.deleteOne({ _id: id });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateBadwordDto } from './dto/create-badword.dto';
import { UpdateBadwordDto } from './dto/update-badword.dto';
import mongoose, { Model } from 'mongoose';
import { Badword, BadwordDocument } from './entities/badword.entity';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class BadwordsService {
  constructor(
    @InjectModel(Badword.name)
    private badwordModel: Model<BadwordDocument>,
  ) {}

  async create(createBadwordDto: CreateBadwordDto, user: IUser) {
    const badword = await this.badwordModel.create({
      ...createBadwordDto,
      createdBy: user._id,
    });

    return {
      _id: badword._id,
      createdAt: badword?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit;

    const totalItems = (await this.badwordModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.badwordModel
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
    return `This action returns a #${id} badword`;
  }

  update(id: number, updateBadwordDto: UpdateBadwordDto) {
    return `This action updates a #${id} badword`;
  }

  async remove(id: string, user?: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found badword';
    return await this.badwordModel.deleteOne({
      _id: id,
    });
  }
}

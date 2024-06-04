import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: SoftDeleteModel<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: IUser) {
    const [comment] = await Promise.all([
      this.commentModel.create({
        ...createCommentDto,
        createdBy: user._id,
      }),
    ]);

    // let comment = await this.commentModel.create({
    //   ...createCommentDto,
    //   createdBy: user._id,
    // });
    return {
      _id: comment._id,
      createdAt: comment?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.commentModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.commentModel
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
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user?: IUser) {
    return await this.commentModel.updateOne(
      { _id: id },
      {
        ...updateCommentDto,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found comment';
    await this.commentModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );
    return await this.commentModel.softDelete({ _id: id });
  }
}

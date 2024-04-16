import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bookmark, BookmarkDocument } from './entities/bookmark.entity';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name)
    private bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto, user: IUser) {
    let bookmark = await this.bookmarkModel.findOneAndUpdate(
      { tweet: createBookmarkDto.tweet, createdBy: user._id },
      {
        ...createBookmarkDto,
        createdBy: user._id,
      },
      { new: true, upsert: true },
    );
    return {
      _id: bookmark._id,
      createdAt: bookmark?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.bookmarkModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.bookmarkModel
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

  async findOne(tweet: string, user: IUser) {
    let bookmark = await this.bookmarkModel.findOne({
      tweet: tweet,
      createdBy: user._id,
    });
    return {
      _id: bookmark._id,
      createdAt: bookmark?.createdAt,
    };
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  async remove(id: string, user?: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found bookmark';
    return await this.bookmarkModel.deleteOne({ _id: id });
  }
}

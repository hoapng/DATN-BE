import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bookmark, BookmarkDocument } from './entities/bookmark.entity';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name)
    private bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto, user: IUser) {
    let bookmark = await this.bookmarkModel.create({
      ...createBookmarkDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: bookmark._id,
      createdAt: bookmark?.createdAt,
    };
  }

  findAll() {
    return `This action returns all bookmarks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  async remove(id: string, user?: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found bookmark';
    return await this.bookmarkModel.deleteOne({ _id: id });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { IUser } from 'src/users/user.interface';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private likeModel: Model<LikeDocument>,
  ) {}

  async create(createLikeDto: CreateLikeDto, user: IUser) {
    let like = await this.likeModel.findOneAndUpdate(
      { tweet: createLikeDto.tweet, createdBy: user._id },
      {
        ...createLikeDto,
        createdBy: user._id,
      },
      { new: true, upsert: true },
    );
    return {
      _id: like._id,
      createdAt: like?.createdAt,
    };
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  async remove(id: string, user?: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found like';
    return await this.likeModel.deleteOne({
      _id: id,
      // createdBy: { _id: user._id },
    });
  }
}

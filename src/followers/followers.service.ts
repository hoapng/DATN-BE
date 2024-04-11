import { Injectable } from '@nestjs/common';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { UpdateFollowerDto } from './dto/update-follower.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, FollowerDocument } from './entities/follower.entity';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';

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

  findAll() {
    return `This action returns all followers`;
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

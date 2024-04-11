import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { TweetType } from 'src/constants/enum';

export class CreateTweetDto {
  @IsNotEmpty({ message: 'Name is required' })
  type: TweetType;

  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  parent: null | mongoose.Schema.Types.ObjectId;

  @IsArray()
  files: string[];
}

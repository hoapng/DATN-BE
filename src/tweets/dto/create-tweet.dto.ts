import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { TweetType } from 'src/constants/enum';

export class CreateTweetDto {
  @IsNotEmpty({ message: 'Type is required' })
  type: TweetType;

  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  content: string;

  parent: mongoose.Schema.Types.ObjectId;

  @IsArray()
  files: string[];

  @IsArray()
  hashtags: string[];
}

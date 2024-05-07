import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { TweetType } from 'src/constants/enum';

export class CreateTweetDto {
  @IsNotEmpty({ message: 'Name is required' })
  type: TweetType;

  title: string | null;

  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  parent: mongoose.Schema.Types.ObjectId | null;

  @IsArray()
  files: string[];

  @IsArray()
  hashtags: string[];
}

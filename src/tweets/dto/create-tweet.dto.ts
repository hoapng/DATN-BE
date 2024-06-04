import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { TweetType } from 'src/constants/enum';

export class CreateTweetDto {
  @IsNotEmpty({ message: 'Name is required' })
  type: TweetType;

  @IsNotEmpty({ message: 'Title is required' })
  title: string | null;

  content: string | null;

  parent: mongoose.Schema.Types.ObjectId | null;

  @IsArray()
  files: string[];

  @IsArray()
  hashtags: string[];
}

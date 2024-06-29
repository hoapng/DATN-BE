import { IsArray, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  post: mongoose.Schema.Types.ObjectId;

  parent: mongoose.Schema.Types.ObjectId;

  // @IsArray()
  // files: string[];
}

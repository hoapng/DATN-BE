import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateLikeDto {
  @IsNotEmpty({ message: 'Tweet_id is required' })
  tweet_id: mongoose.Schema.Types.ObjectId;
}

import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateFollowerDto {
  @IsNotEmpty({ message: 'User_id is required' })
  user: mongoose.Schema.Types.ObjectId;
}

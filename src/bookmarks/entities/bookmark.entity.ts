import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/schemas/user.schema';

export type BookmarkDocument = HydratedDocument<Bookmark>;

@Schema({ timestamps: true })
export class Bookmark {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tweet.name })
  tweet: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);

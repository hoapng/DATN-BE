import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TweetType } from 'src/constants/enum';
import { User } from 'src/users/schemas/user.schema';

export type TweetDocument = HydratedDocument<Tweet>;

@Schema({ timestamps: true })
export class Tweet {
  @Prop()
  type: TweetType;

  @Prop()
  title: string | null;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tweet.name })
  parent: mongoose.Schema.Types.ObjectId | null; //  chỉ null khi tweet gốc

  @Prop()
  files: string[];

  @Prop()
  hashtags: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;

  //   @Prop({ type: Object })
  //   updatedBy: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  deletedBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);

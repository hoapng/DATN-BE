import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TweetType } from 'src/constants/enum';

export type TweetDocument = HydratedDocument<Tweet>;

@Schema({ timestamps: true })
export class Tweet {
  @Prop()
  type: TweetType;

  @Prop()
  content: string;

  @Prop()
  parent_id: null | mongoose.Schema.Types.ObjectId; //  chỉ null khi tweet gốc

  @Prop()
  files: string[];

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  //   @Prop({ type: Object })
  //   updatedBy: {
  //     _id: mongoose.Schema.Types.ObjectId;
  //     email: string;
  //   };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

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

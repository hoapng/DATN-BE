import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FollowerDocument = HydratedDocument<Follower>;

@Schema({ timestamps: true })
export class Follower {
  @Prop({ type: Object })
  user: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);

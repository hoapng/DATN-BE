import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HashtagDocument = HydratedDocument<Hashtag>;

@Schema({ timestamps: true })
export class Hashtag {
  @Prop()
  name: string;

  @Prop()
  createdAt: Date;
}

export const HashtagSchema = SchemaFactory.createForClass(Hashtag);

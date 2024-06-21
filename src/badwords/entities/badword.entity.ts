import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type BadwordDocument = HydratedDocument<Badword>;

@Schema({ timestamps: true })
export class Badword {
  @Prop()
  word: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;
}

export const BadwordSchema = SchemaFactory.createForClass(Badword);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductType } from 'src/constants/enum';
import { User } from 'src/users/schemas/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  address: string;

  @Prop()
  status: ProductType;

  @Prop()
  files: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;

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

export const ProductSchema = SchemaFactory.createForClass(Product);

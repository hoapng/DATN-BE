import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user: IUser) {
    const product = await this.productModel.create({
      ...createProductDto,
      createdBy: user._id,
    });

    return {
      _id: product._id,
      createdAt: product?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.productModel
      .find(filter)
      // .aggregate([
      //   {
      //     $match: {
      //       ...filter,
      //       updatedAt: {
      //         $gte: new Date(new Date().setDate(new Date().getDate() - 14)),
      //       },
      //     },
      //   },
      // ])
      .skip(offset)
      .limit(defaultLimit)
      .sort((sort as any) || '-updatedAt')
      // .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string, qs: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found product';
    const { filter, sort, projection, population } = aqp(qs);

    return this.productModel.findOne({ _id: id }).populate(population).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto, user?: IUser) {
    return await this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        // updatedBy: {
        //   _id: user._id,
        //   email: user.email,
        // },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Not found product';
    await this.productModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );
    return await this.productModel.softDelete({ _id: id });
  }
}

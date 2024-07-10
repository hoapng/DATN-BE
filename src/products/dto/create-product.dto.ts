import { IsArray, IsNotEmpty } from 'class-validator';
import { ProductType } from 'src/constants/enum';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string | null;

  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsArray()
  @IsNotEmpty({ message: 'Image is required' })
  files: string[];

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'Status is required' })
  status: ProductType;
}

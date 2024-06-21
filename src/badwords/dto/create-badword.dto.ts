import { IsNotEmpty } from 'class-validator';

export class CreateBadwordDto {
  @IsNotEmpty({ message: 'Word is required' })
  word: string;
}

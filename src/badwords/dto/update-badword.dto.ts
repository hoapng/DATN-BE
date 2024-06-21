import { PartialType } from '@nestjs/mapped-types';
import { CreateBadwordDto } from './create-badword.dto';

export class UpdateBadwordDto extends PartialType(CreateBadwordDto) {}

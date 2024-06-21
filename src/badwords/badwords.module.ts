import { Module } from '@nestjs/common';
import { BadwordsService } from './badwords.service';
import { BadwordsController } from './badwords.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Badword, BadwordSchema } from './entities/badword.entity';

@Module({
  controllers: [BadwordsController],
  providers: [BadwordsService],
  imports: [
    MongooseModule.forFeature([{ name: Badword.name, schema: BadwordSchema }]),
  ],
})
export class BadwordsModule {}

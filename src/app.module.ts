import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { FilesModule } from './files/files.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { FollowersModule } from './followers/followers.module';
import { CaslModule } from './casl/casl.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { CommentsModule } from './comments/comments.module';
import { ProductsModule } from './products/products.module';
import { BadwordsModule } from './badwords/badwords.module';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   'mongodb+srv://hoapng:Hoa.png194566@nestjs.aqg8gm0.mongodb.net/',
    // ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        // connectionFactory: (connection) => {
        //   connection.plugin(softDeletePlugin);
        //   return connection;
        // },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    TweetsModule,
    LikesModule,
    BookmarksModule,
    FollowersModule,
    CaslModule,
    HashtagModule,
    CommentsModule,
    ProductsModule,
    BadwordsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}

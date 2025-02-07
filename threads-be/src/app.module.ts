import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { backEnvironment } from './environment';

@Module({
  imports: [
    UsersModule,
    CommentsModule,
    MongooseModule.forRoot(backEnvironment.DataBaseUrl)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

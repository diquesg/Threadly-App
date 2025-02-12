import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway], // Adicione o CommentsGateway como provider
  exports: [CommentsService, CommentsGateway],   // Exporte para outros módulos se necessário
})
export class CommentsModule { }

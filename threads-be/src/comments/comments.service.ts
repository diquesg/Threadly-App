import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) { }

  create(createCommentDto: CreateCommentDto) {
    const createdComment = this.commentModel.create({
      text: createCommentDto.text,
      parent: createCommentDto.parentId || null,
      user: createCommentDto.userId,
    });
    return createdComment.then((doc) => {
      return doc.populate([
        { path: 'user', select: 'name avatarUrl' },
        { path: 'parent', populate: { path: 'user', select: 'name avatarUrl' } }
      ]);
    });
  }

  findAll() {

  }

  getTopLevelComments() {
    return this.commentModel.find({
      parent: null
    }).populate({ path: 'user', select: 'name avatarUrl' })
      .populate({ path: 'parent', populate: { path: 'user', select: 'name avatarUrl' } }).sort({ createdAt: -1 }).exec();
  }

  getCommentsByParentId(parentId: string) {
    return this.commentModel.find({ parent: parentId })
      .populate({ path: 'user', select: 'name avatarUrl' })
      .populate({
        path: 'parent',
        populate: { path: 'user', select: 'name avatarUrl' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: string) {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async toggleLike(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new Error('Comentário não encontrado');
    }

    // Verifica se o usuário já deu like
    const userIndex = comment.likes.findIndex((id) => id.toString() === userId);
    if (userIndex >= 0) {
      // Remove o like
      comment.likes.splice(userIndex, 1);
    } else {
      // Adiciona o like
      comment.likes.push(new Types.ObjectId(userId));
    }
    return comment.save();
  }

}

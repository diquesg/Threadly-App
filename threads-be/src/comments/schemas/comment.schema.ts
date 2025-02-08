
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: true
})
export class Comment {
  @Prop()
  text!: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes!: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null })
  parent: Comment | null = null;



}

export const CommentSchema = SchemaFactory.createForClass(Comment);

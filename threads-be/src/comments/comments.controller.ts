import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll(@Query() queryParams) {
    if (queryParams.parentId) {
      try {
        return this.commentsService.getCommentsByParentId(queryParams.parentId);
      } catch (e) {
        throw new BadRequestException('Something wrong happened', { cause: new Error(e.message), description: 'Comment not found' })
      }
    }
    return this.commentsService.getTopLevelComments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @Post(':id/toggle-like')
  async toggleLike(
    @Param('id') id: string,
    @Body() toggleLikeDto: ToggleLikeDto,
  ): Promise<Comment> {
    return this.commentsService.toggleLike(id, toggleLikeDto.userId);
  }
}
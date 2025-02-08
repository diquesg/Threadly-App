import { CommonModule, NgIf } from '@angular/common';
import { Component, effect, inject, Input, signal, OnInit } from '@angular/core';
import { CreateCommentComponent } from "../create-comment/create-comment.component";
import { Comment } from '../../interfaces/comment.interface';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { RelativeTimePipe } from './relative-time-pipe';
import { CommentsService } from '../../../../../threads-be/src/comments/comments.service';
import { CommentStoreService } from '../../services/comment-store.service';

@Component({
  selector: 'app-comment',
  imports: [NgIf, CommonModule, CreateCommentComponent, RelativeTimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() nestingLevel = 0;

  isExpanded = signal(false);
  isReplying = signal(false);
  commentService = inject(CommentService)
  nestedComments = signal<Comment[]>([]);
  userService = inject(UserService)
  commentStoreService = inject(CommentStoreService)

  ngOnInit(): void {
    this.fetchNestedComments();
  }

  fetchNestedComments(): void {
    this.commentService.getComments(this.comment._id).subscribe(comments => {
      this.nestedComments.set(comments);
    });
  }

  getNestedStyles(): { [key: string]: string } {
    const maxWidth = 100;
    const widthReduction = 2;
    const marginStep = 6;


    const createdAt = new Date(this.comment.createdAt);

    const width = Math.max(maxWidth - this.nestingLevel * widthReduction, 60);
    const margin = this.nestingLevel * marginStep;

    return {
      'width': `${width}%`,
      'margin-left': `${margin}px`,
      'margin-right': `${margin}px`,
      'transform-origin': 'center center',
      'box-sizing': 'border-box'
    };
  }

  isNestedComment(): boolean {
    if (this.comment.parent) {
      return true
    }
    return false
  }

  get getParentName() {
    console.log('Comment parent:', this.comment.parent?.user);
    if (this.isNestedComment()) {
      return this.comment.parent?.user.name;
    }
    return null;
  }


  isParentComment() {
    if (!this.comment.parent) {
      return true
    }
    return false
  }

  get hasNestedComment(): boolean {
    return this.nestedComments().length > 0;
  }

  nestedCommentsEffect = effect(() => {
    if (this.isExpanded()) {
      this.commentService.getComments(this.comment._id).subscribe(comments => {
        this.nestedComments.set(comments);
        this.nestedComments.length + 1;
      })
    }
  })

  getNestedCommentsCount(): number {
    return this.nestedComments().length;
  }

  toggleExpanded() {
    this.isExpanded.set(!this.isExpanded());
  }

  toggleReply() {
    this.isReplying.set(!this.isReplying());
    if (this.isReplying()) {
      this.isExpanded.set(true);
    }
  }

  createComment(formValues: { text: string }) {
    const { text } = formValues;
    const user = this.userService.getUserFromStorage();
    if (!user) {
      return;
    }
    this.commentService.createComment({
      text,
      userId: user._id,
      parentId: this.comment._id
    }).subscribe(createdComment => {
      this.nestedComments.set([
        createdComment,
        ...this.nestedComments()
      ])
    });
  }

  commentTrackBy(_index: number, comment: Comment) {
    return comment._id;
  }

  // comment.component.ts (dentro do método deleteComment)
  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log("Deleted comment.");
        // Atualiza o estado global removendo o comentário
        this.commentStoreService.removeComment(commentId);
      },
      error: (error) => {
        console.error("Error trying to delete comment: ", error);
      }
    });
  }



  commentIsFromLocalUser() {
    const user = this.userService.getUserFromStorage()
    if (user) {
      if (this.comment.user._id === user._id) {
        return true
      }
      return false
    } else {
      console.log("No local user found")
      return false
    }
  }


  deleteCommentByLocalUserId() {
    const user = this.userService.getUserFromStorage()
    if (user) {
      if (this.comment.user._id === user._id) {
        this.deleteComment(this.comment._id)
      }
    }
  }

}

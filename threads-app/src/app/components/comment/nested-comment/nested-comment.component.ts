import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../interfaces/comment.interface';
import { RelativeTimePipe } from '../relative-time-pipe';
import { UserService } from '../../../services/user.service';
import { CreateCommentComponent } from '../../create-comment/create-comment.component';

@Component({
  selector: 'app-nested-comment',
  imports: [NgIf, CommonModule, RelativeTimePipe, CreateCommentComponent],
  templateUrl: './nested-comment.component.html',
  styleUrls: ['./nested-comment.component.scss'],
  standalone: true,
})
export class NestedCommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() nestingLevel: number = 0;


  nestedComments = signal<Comment[]>([]);
  isLoading: boolean = false;
  isExpanded = signal(false);
  isReplying = signal(false);
  userService = inject(UserService);


  @Output() commentDeleted = new EventEmitter<string>();

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.fetchNestedComments();
  }

  handleNestedCommentDeleted(deletedCommentId: string) {
    this.nestedComments.update(comments =>
      comments.filter(c => c._id !== deletedCommentId)
    );
  }

  get hasNestedComment(): boolean {
    return this.nestedComments().length > 0;
  }

  isNestedComment(): boolean {
    if (this.comment.parent) {
      return true
    }
    return false
  }


  fetchNestedComments(): void {
    this.isLoading = true;

    this.commentService.getComments(this.comment._id).subscribe(
      (comments) => {
        this.nestedComments.set(comments);
        this.isLoading = false;
      },
      (error) => {
        console.error("Erro ao carregar comentários:", error);
        this.isLoading = false;
      }
    );
  }
  commentTrackBy(index: number, comment: Comment): string {
    return comment._id;
  }

  scrollTo(event: Event, elementId: string) {
    event.preventDefault();

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        element.classList.add('bg-blue-100', 'transition-colors', 'duration-500');

        setTimeout(() => element.classList.remove('bg-blue-100'), 1500);
      } else {
        console.warn(`Elemento com ID ${elementId} não encontrado.`);
      }
    }, 0);
  }

  get refId(): string {
    return this.comment.parent!._id
  }

  get getParentName() {
    return this.comment.parent?.user.name;
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



  toggleReply() {
    this.isReplying.set(!this.isReplying());
    if (this.isReplying()) {
      this.isExpanded.set(true);
    }
  }

  toggleExpanded() {
    this.isExpanded.set(!this.isExpanded());
  }

  toggleLike(): void {
    const user = this.userService.getUserFromStorage();
    if (!user) {
      return;
    }
    this.commentService.toggleLike(this.comment._id, user._id).subscribe(
      (updatedComment) => {
        this.comment.likes = updatedComment.likes;
      },
      (error) => {
        console.error('Erro ao alternar like:', error);
      }
    );
  }

  isLikedByCurrentUser(): boolean {
    const user = this.userService.getUserFromStorage();
    if (!user || !this.comment.likes) {
      return false;
    }
    return this.comment.likes.includes(user._id);
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log("Deleted comment.");
        this.commentDeleted.emit(commentId);
      },
      error: (error) => {
        console.error("Error trying to delete comment: ", error);
      }
    });
  }

  deleteCommentByLocalUserId() {
    const user = this.userService.getUserFromStorage()
    if (user) {
      if (this.comment.user._id === user._id) {
        this.deleteComment(this.comment._id)
      }
    }
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

  getNestedCommentsCount(): number {
    return this.nestedComments().length;
  }
}

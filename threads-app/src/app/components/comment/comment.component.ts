import { CommonModule, NgIf } from '@angular/common';
import { Component, effect, inject, Input, signal, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateCommentComponent } from "../create-comment/create-comment.component";
import { Comment } from '../../interfaces/comment.interface';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { RelativeTimePipe } from './relative-time-pipe';
import { NestedCommentComponent } from "./nested-comment/nested-comment.component";
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-comment',
  imports: [NgIf, CommonModule, CreateCommentComponent, RelativeTimePipe, NestedCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() nestingLevel = 0;
  @Output() commentDeleted = new EventEmitter<string>();
  parentComments = signal<Comment[]>([]);

  isLoading: boolean = true;

  isExpanded = signal(false);
  isReplying = signal(false);
  commentService = inject(CommentService)
  nestedComments = signal<Comment[]>([]);
  userService = inject(UserService)
  websocketService = inject(WebsocketService);

  constructor() {
    this.loadParentComments();
  }

  loadParentComments() {
    this.commentService.getComments().subscribe(comments => {
      this.parentComments.set(comments);
    });
  }



  ngOnInit(): void {
    this.fetchNestedComments();

    this.websocketService.onNewComment().subscribe((newComment: Comment) => {
      if (
        newComment.parent &&
        newComment.parent._id.toString() === this.comment._id.toString() &&
        !this.nestedComments().some(c => c._id.toString() === newComment._id.toString())
      ) {
        this.nestedComments.update(current => [newComment, ...current]);
      }
    });
  }

  fetchNestedComments(): void {
    this.isLoading = true;
    this.commentService.getComments(this.comment._id).subscribe(
      (comments) => {
        this.nestedComments.set(comments);
        this.isLoading = false;
      },
      (error) => {
        console.error("Erro ao carregar comentários aninhados:", error);
        this.isLoading = false;
      }
    );
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

  get refId(): string {
    return this.comment.parent!._id
  }

  isParentComment() {
    if (!this.comment.parent) {
      return true
    }
    return false
  }

  scrollTo(event: Event, elementId: string) {
    event.preventDefault();

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        element.classList.add('bg-blue-100', 'transition-colors', 'duration-500');

        setTimeout(() => element.classList.remove('bg-blue-100'), 1500);
      } else {
        console.warn(`Elemento com ID ${elementId} não encontrado.`);
      }
    }, 0);
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
    });
  }


  commentTrackBy(_index: number, comment: Comment) {
    return comment._id;
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

  handleCommentDeleted(deletedCommentId: string) {
    this.parentComments.update(comments =>
      comments.filter(c => c._id !== deletedCommentId)
    );
  }

  handleNestedCommentDeleted(deletedCommentId: string) {
    this.nestedComments.update(comments =>
      comments.filter(c => c._id !== deletedCommentId)
    );
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

}

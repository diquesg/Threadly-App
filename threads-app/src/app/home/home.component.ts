// src/app/home/home.component.ts
import { Component, OnInit, EventEmitter, Output, inject, signal } from '@angular/core';
import { Comment } from '../interfaces/comment.interface';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { CommentStoreService } from '../services/comment-store.service';
import { WebsocketService } from '../services/websocket.service'; // importe o serviço
import { CommonModule } from '@angular/common';
import { CreateCommentComponent } from '../components/create-comment/create-comment.component';
import { CommentComponent } from '../components/comment/comment.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CreateCommentComponent, CommentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'

})
export class HomeComponent implements OnInit {
  commentService = inject(CommentService);
  userService = inject(UserService);
  commentStoreService = inject(CommentStoreService);
  websocketService = inject(WebsocketService); // injete o websocket

  // Usando signal para os comentários (pode ser array ou outro estado)
  comments = signal<Comment[]>([]);
  @Output() commentDeleted = new EventEmitter<string>();

  constructor() {
    // Remover loadParentComments() daqui
  }

  ngOnInit(): void {
    // Carregar comentários iniciais uma única vez
    this.loadParentComments();

    // Subscrição para novos comentários via WebSocket
    this.websocketService.onNewComment().subscribe((newComment: Comment) => {
      if (!newComment.parent && !this.comments().some(c => c._id === newComment._id)) {
        this.comments.update(current => [newComment, ...current]);
      }
    });

    // Subscrição para atualizações do store
    this.commentStoreService.comments$.subscribe(comments => {
      this.comments.set(comments);
    });
  }


  loadParentComments() {
    this.commentService.getComments().subscribe(comments => {
      this.comments.set(comments);
    });
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
    }).subscribe();
  }



  handleCommentDeleted(deletedCommentId: string) {
    this.comments.update(comments =>
      comments.filter(c => c._id !== deletedCommentId)
    );
  }

  commentTrackBy(_index: number, comment: Comment) {
    return comment._id;
  }
}

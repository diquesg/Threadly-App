import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommentComponent } from "../components/comment/comment.component";
import { CommentService } from '../services/comment.service';
import { Comment } from '../interfaces/comment.interface';
import { NgFor } from '@angular/common';
import { CreateCommentComponent } from '../components/create-comment/create-comment.component';
import { UserService } from '../services/user.service';
import { CommentStoreService } from '../services/comment-store.service';

@Component({
  selector: 'app-home',
  imports: [CommentComponent, CommentComponent, NgFor, CreateCommentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private commentStoreService: CommentStoreService) {
    this.loadParentComments();
  }
  commentService = inject(CommentService);
  comments = signal<Comment[]>([]);
  @Output() commentDeleted = new EventEmitter<string>();

  UserService = inject(UserService);

  ngOnInit(): void {
    this.commentStoreService.comments$.subscribe(comments => {
      this.comments.set(comments);
      this.getComments();
    });
  }

  loadParentComments() {
    this.commentService.getComments().subscribe(comments => {
      this.comments.set(comments);
    });
  }

  handleCommentDeleted(deletedCommentId: string) {
    this.comments.update(comments =>
      comments.filter(c => c._id !== deletedCommentId)
    );
  }


  getComments() {
    this.commentService.getComments().subscribe((comments) => {
      this.comments.set(comments);
    });
  }

  createComment(formValues: { text: string }) {
    const { text } = formValues;
    const user = this.UserService.getUserFromStorage();
    if (!user) {
      return;
    }
    this.commentService.createComment({
      text,
      userId: user._id,
    }).subscribe(createdComment => {
      this.comments.set([
        createdComment,
        ...this.comments()
      ])
    });
  }




  commentTrackBy(_index: number, comment: Comment) {
    return comment._id;
  }

}

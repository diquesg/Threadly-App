import { Component, inject, OnInit, signal } from '@angular/core';
import { CommentComponent } from "../components/comment/comment.component";
import { CommentService } from '../services/comment.service';
import { Comment } from '../interfaces/comment.interface';
import { NgFor } from '@angular/common';
import { CreateCommentComponent } from '../components/create-comment/create-comment.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  imports: [CommentComponent, CommentComponent, NgFor, CreateCommentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  commentService = inject(CommentService);
  comments = signal<Comment[]>([]);

  UserService = inject(UserService);

  ngOnInit(): void {
    this.getComments();
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

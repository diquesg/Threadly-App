import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
    providedIn: 'root'
})
export class CommentStoreService {
    private commentsSubject = new BehaviorSubject<Comment[]>([]);
    comments$ = this.commentsSubject.asObservable();

    setComments(comments: Comment[]) {
        this.commentsSubject.next(comments);
    }

    removeComment(deletedCommentId: string) {
        const currentComments = this.commentsSubject.getValue();
        this.commentsSubject.next(currentComments.filter(c => c._id !== deletedCommentId));
    }
}

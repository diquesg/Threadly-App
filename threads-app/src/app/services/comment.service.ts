import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../interfaces/comment.interface';
import { Observable } from 'rxjs';

type CreateCommentDto = {
  parentId?: string;
  text: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  http = inject(HttpClient);

  getComments(parentId: string = '') {
    let url = `${environment.apiBaseUrl}/comments`
    if (parentId) {
      url += `?parentId=${parentId}`
    }
    return this.http.get<Comment[]>(url)
  }

  createComment(comment: CreateCommentDto) {
    return this.http.post<Comment>(`${environment.apiBaseUrl}/comments`, comment)
  }

  deleteComment(id: string) {
    return this.http.delete(`${environment.apiBaseUrl}/comments/${id}`, { responseType: 'text' });
  }

  toggleLike(commentId: string, userId: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.apiBaseUrl}/comments/${commentId}/toggle-like`,
      { userId }
    );
  }
}

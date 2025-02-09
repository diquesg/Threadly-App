import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  localStorageKey = 'threads_user';
  http = inject(HttpClient);

  createUser(name: string, avatarUrl: string) {
    return this.http.post<User>(`${environment.apiBaseUrl}/users`, {
      name,
      avatarUrl
    });
  }

  saveUserToStorage(user: User) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }
  getUserFromStorage(): User | null {
    const user = localStorage.getItem(this.localStorageKey);
    return user ? JSON.parse(user) as User : null;
  }
}

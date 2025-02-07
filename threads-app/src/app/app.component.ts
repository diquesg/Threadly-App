import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';

interface RandomUserResponse {
  usernames: string[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'threads-app';
  userService = inject(UserService);

  ngOnInit(): void {
    const user = this.userService.getUserFromStorage();

    if (!user) {
      this.createRandomUser().then(({ username, avatarUrl }) => {
        this.userService.createUser(username, avatarUrl).subscribe({
          next: (newUser) => {
            console.log('Usuário criado:', newUser);
            this.userService.saveUserToStorage(newUser);
          },
          error: (error) => {
            console.error('Erro ao criar usuário no backend:', error);
          }
        });
      }).catch(error => {
        console.error('Erro ao gerar usuário aleatório:', error);
      });
    }
  }

  getRandomUserResponse() {
    return this.http.get<RandomUserResponse>(environment.randomUserApiUrl);
  }

  getRandomIconResponse(username: string): string {
    return `${environment.randomIconApiUrl}${encodeURIComponent(username)}`;
  }

  async createRandomUser(): Promise<{ username: string; avatarUrl: string }> {
    return new Promise((resolve, reject) => {
      this.getRandomUserResponse().subscribe({
        next: (response) => {
          const username = response.usernames[0];
          if (!username) {
            return reject('Nenhum nome retornado pela API');
          }
          const avatarUrl = this.getRandomIconResponse(username);
          console.log('Nome gerado:', username);
          console.log('Avatar URL gerado:', avatarUrl);
          resolve({ username, avatarUrl });
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }
}
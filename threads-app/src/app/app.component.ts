import { Component, inject, OnInit } from '@angular/core'; // Adicione OnInit
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';

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

  constructor() {
  }

  ngOnInit() {
    const user = this.userService.getUserFromStorage();

    if (!user) {
      this.getRandomUsername().then((username) => {
        this.userService.createUser(username).subscribe(user => {
          console.log('user created:', user);
          this.userService.saveUserToStorage(user);
        });
      });
    }
  }

  getRandomUserResponse() {
    return this.http.get<RandomUserResponse>('https://usernameapiv1.vercel.app/api/random-usernames');
  }

  async getRandomUsername(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getRandomUserResponse().subscribe({
        next: (response) => {
          const username = response.usernames[0];
          resolve(username);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }
}
// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: Socket;

    constructor() {
        // Suponha que environment.socketUrl esteja definido (ex: 'http://localhost:3000')
        this.socket = io(environment.socketUrl, { transports: ['websocket'] });
    }

    // Observable que emite um novo comentário quando o servidor envia o evento "newComment"
    onNewComment(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('newComment', (comment) => {
                observer.next(comment);
            });
        });
    }
}

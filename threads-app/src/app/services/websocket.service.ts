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
        this.socket = io(environment.socketUrl, { transports: ['websocket'] });
    }

    onNewComment(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('newComment', (comment) => {
                observer.next(comment);
            });
        });
    }
}

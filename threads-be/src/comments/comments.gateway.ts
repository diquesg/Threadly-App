import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Permitir CORS para evitar bloqueios
export class CommentsGateway {
    @WebSocketServer()
    server: Server;

    sendNewComment(comment: any) {
        this.server.emit('newComment', comment);
    }
}

// comments.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CommentsGateway {
    @WebSocketServer()
    server: Server;

    // Método para emitir um novo comentário para todos os clientes conectados
    sendNewComment(comment: any) {
        this.server.emit('newComment', comment);
    }
}

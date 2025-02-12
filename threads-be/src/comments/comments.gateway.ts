import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentsGateway {
    @WebSocketServer()
    server: Server;

    sendNewComment(comment: any) {
        console.log('Emitindo novo comentário:', comment); // Log para depuração
        this.server.emit('newComment', comment);
    }
}

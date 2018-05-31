import * as http from 'http';
import * as socketIo from 'socket.io';

export class WebSocketHelper {
   private io: SocketIO.Server;

   public initiate(server: http.Server): SocketIO.Server {
       this.io = socketIo(server);

       return this.io;
   }
}
import * as http from 'http';
import * as io from 'socket.io';

export class WebSocketHelper {
    private io: io;

    public initiate(server: http.Server): io {
        this.io = io(server);

        return this.io;
    }
}
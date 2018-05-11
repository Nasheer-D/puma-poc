import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { HttpResponse } from '../utils/web/models/HttpResponse';
import { Constants } from '../app.constants';

@Injectable()
export class TxStatusService {
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = io(Constants.webSocketHost);
    }

    public onTxStatusChange(sessionID: string) {
        return Observable.create(observer => {
            // Receives status updates every time the txStatus/ api is called and pushes them to the client
            this.socket.on(`txStatus/${sessionID}`, (httpResponse: HttpResponse) => {
                observer.next(httpResponse);
            });
        });
    }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { HttpResponse } from '../utils/web/models/HttpResponse';

@Injectable()
export class TxStatusService {
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = io('http://localhost:8080');
    }

    public onTxStatusChange() {
        return Observable.create(observer => {
            this.socket.on('txStatus', (httpResponse: HttpResponse) => {
                observer.next(httpResponse);
            });
        });
    }
}

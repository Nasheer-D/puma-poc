import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import { Item } from '../models/Item';
import { Observable } from 'rxjs/Observable';
import { ObserveOnSubscriber } from 'rxjs/operators/observeOn';

@Injectable()
export class TransactionService {

    private actionUrl: string;

    public constructor(private http: HttpClient) {
        this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}transaction/`;
    }

    public initiateTransactionSession(): Observable<any> {
        return new HttpGetRequest(this.http, `${this.actionUrl}init`).getResult();
    }

    public getTxDetails(sessionID: string, itemID: string): Observable<any> {
        return new HttpGetRequest(this.http, `${this.actionUrl}tx/${sessionID}/${itemID}`).getResult();
    }

    public sendTransactionStatus(sessionId: string, txhash: string, status: number) {
        return new HttpGetRequest(this.http,
            `${this.actionUrl}txStatus/session/${sessionId}?tx=${txhash}&status=${status}&fromapp=0`).getResult();
    }
}

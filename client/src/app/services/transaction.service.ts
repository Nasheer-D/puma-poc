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
        // The constractor declares host and apiPrefix for the calls
        this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}transaction/`;
    }

    public initiateTransactionSession(): Observable<any> {
        // this function makes a call to the init/ API that returns the session id and initiates the transaction process
        return new HttpGetRequest(this.http, `${this.actionUrl}init`).getResult();
    }

    public getTxDetails(sessionID: string, itemID: string): Observable<any> {
        // makes a call that builds the transaction data and returns it back including the item details and signature
        return new HttpGetRequest(this.http, `${this.actionUrl}tx/${sessionID}/${itemID}`).getResult();
    }

    public sendTransactionStatus(sessionId: string, txhash: string, status: number) {
        // Returns the status of the pending transaction..it is repeated until the transaction is completed
        return new HttpGetRequest(this.http,
            `${this.actionUrl}txStatus/session/${sessionId}?tx=${txhash}&status=${status}&fromapp=0`).getResult();
    }
}

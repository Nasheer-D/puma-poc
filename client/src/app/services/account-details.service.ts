import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Constants } from '../app.constants';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';

@Injectable()
export class AccountDetailsService {
  private actionUrl: string;
  public constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}account/`;
  }

  public getAllTransactions() {
    return new HttpGetRequest(this.http, this.actionUrl).getResult();
  }
}

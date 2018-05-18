import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../app.constants';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';

@Injectable()
export class RateService {
  private actionUrl: string;
  public constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}rate/`;
   }

  public getRate() {
    return new HttpGetRequest(this.http, this.actionUrl).getResult();
  }
}

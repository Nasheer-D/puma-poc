import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import { Item } from '../models/Item';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemsService {
  private actionUrl: string;

  public constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}items/`;
  }

  public getAllItems() {
    return new HttpGetRequest(this.http, this.actionUrl).getResult();
  }

  public getItemByID(itemID: string): Observable<any> {
    return new HttpGetRequest(
      this.http,
      this.actionUrl + itemID
    ).getResult();
  }
}

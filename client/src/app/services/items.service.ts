import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import { Item } from '../models/Item';

@Injectable()
export class ItemsService {
  private actionUrl: string;

  public constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}items`;
  }

  public getAllItems() {
    return new HttpGetRequest(this.http, this.actionUrl).getResult();
  }

  public getItemDetails(itemID: string) {
    return new HttpGetRequest(
      this.http,
      this.actionUrl + `/${itemID}`
    ).getResult();
  }
}

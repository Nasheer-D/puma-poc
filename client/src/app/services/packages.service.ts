import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../app.constants';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PackagesService {
  private actionUrl: string;
  public constructor(private http: HttpClient) {
    this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}packages/`;
   }

  public getAllPackages() {
    return new HttpGetRequest(this.http, this.actionUrl).getResult();
  }

  public getPackageByID(packageID: string): Observable<any> {
    return new HttpGetRequest (
      this.http, this.actionUrl + packageID ).getResult();
  }
}

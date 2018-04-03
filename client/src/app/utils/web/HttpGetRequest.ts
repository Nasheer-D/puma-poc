import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './models/HttpResponse';
import { AuthenticationService } from '../../services/authentication.service';

export class HttpGetRequest extends HttpRequest {
  public constructor(private http: HttpClient,
    private actionUrl: string,
    authService?: AuthenticationService) {
    super(authService);
  }

  public getResult(): Observable<any> {
    return this.http
      .get(this.actionUrl, this.basicAuthorizationHeader());
  }
}

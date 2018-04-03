import { HttpRequest } from './HttpRequest';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from './models/HttpResponse';
import { AuthenticationService } from '../../services/authentication.service';

export class HttpDeleteRequest extends HttpRequest {
  public constructor(private http: HttpClient,
    private actionUrl: string,
    authService?: AuthenticationService) {
    super(authService);
  }

  public getResult(): Observable<any> {
    return this.http
      .delete(this.actionUrl, this.basicAuthorizationHeader());
  }
}

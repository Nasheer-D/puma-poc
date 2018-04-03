import {Observable} from 'rxjs/Observable';
import {HttpResponse} from './models/HttpResponse';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../services/authentication.service';

export abstract class HttpRequest {
  protected authService: AuthenticationService;

  protected constructor(authService?: AuthenticationService) {
    this.authService = authService;
    this.getAuthHeader();
  }

  private async getAuthHeader(): Promise<void> {
    if (this.authService) {
      await this.authService.getToken();
    }
  }

  protected basicAuthorizationHeader(): {} {
    if (this.authService) {
      return {headers: this.authService.createAuthorizationHeader()};
    }

    return {};
  }

  public abstract getResult(): Observable<HttpResponse>;
}

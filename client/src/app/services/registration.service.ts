import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from '../app.constants';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';
import { HttpPostRequest } from '../utils/web/HttpPostRequest';
import { IRegistrationDetails } from '../models/User';
import { HttpResponse } from '../utils/web/models/HttpResponse';

@Injectable()
export class RegistrationService {
    private actionUrl: string;
    public constructor(private http: HttpClient, private authService: AuthenticationService) {
        this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}register/`;
    }

    public registerNewUser(registrationDetails: IRegistrationDetails): Observable<any> {
        return new HttpPostRequest(this.http, this.actionUrl, registrationDetails).getResult();
    }
}

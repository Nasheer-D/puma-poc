import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import {Item} from '../models/Item';

@Injectable()
export class ItemsService {
    private actionUrl: string;

    public constructor(private http:HttpClient, private authService: AuthenticationService) {
            this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}items`;   
    }

    public getAllImages(){
        return new HttpGetRequest(this.http, this.actionUrl, this.authService).getResult();   
     }
}

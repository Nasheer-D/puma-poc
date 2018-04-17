import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpGetRequest } from '../utils/web/HttpGetRequest';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../app.constants';
import { Item } from '../models/Item';

@Injectable()
export class ItemsIDService {
    private actionUrl: string;

    public constructor(private http: HttpClient) {
        this.actionUrl = `${Constants.apiHost}${Constants.apiPrefix}items/id`;
    }

    public getItemsById() {
        return {
            itemID: 'item01',
            ownerID: 'owner01',
            title: 'Item 01 Title',
            description: 'Item 01 Description',
            price: 1000,
            size: 2100,
            licence: 'standard',
            itemUrl: 'https://s3.amazonaws.com/pumapay-poc-items/pumapay01.png',
            tags: [
              'puma',
              ' ico',
              ' crypto '
            ],
            rating: [
              4,
              3.5,
              5
            ],
            uploadedDate: 1522759457
          };
    }
}

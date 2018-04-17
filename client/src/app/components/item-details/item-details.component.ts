import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent {
  public itemsDetails: Item = <Item>{
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

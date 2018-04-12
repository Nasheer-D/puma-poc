import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/Item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [ItemsService]

})
export class ItemsComponent implements OnInit {
  public items: Array<Item> = new Array<Item>();

  public constructor(private router: Router, private itemsService: ItemsService) { }

  public ngOnInit() {
    this.itemsService.getAllItems().subscribe((items: HttpResponse) => {
      this.items = items.data;
    });
  }
}

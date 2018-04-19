import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/Item';
import { Http } from '@angular/http';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [ItemsService]
})
export class ItemsComponent implements OnInit {
  public items: Item[] = [];

  public constructor(
    private router: Router,
    private itemsService: ItemsService
  ) {}

  public ngOnInit() {
    this.itemsService.getAllItems().subscribe((res: HttpResponse) => {
      if (res.success) {
        this.items = res.data;
      } else {
        alert(res.message);
      }
    });
  }

  public goToItemDetails(itemID: string) {
    console.log(itemID);
    this.router.navigate(['/items', itemID]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/Item';
import { Http } from '@angular/http';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [ItemsService]
})
export class ItemsComponent implements OnInit {
  public items: Item[] = [];
  sortedItems: any[];
  order: string = 'item.rating';
  reverse: boolean = false;

  public constructor(
    private router: Router,
    private itemsService: ItemsService,
    private orderPipe: OrderPipe
  ) {}

  public ngOnInit() {
    this.itemsService.getAllItems().subscribe((res: HttpResponse) => {
      if (res.success) {
        this.items = res.data;
      } else {
        alert(res.message);
      }
    });

    console.log(this.orderPipe.transform(this.items, this.order));
  }

  public goToItemDetails(itemID: string): void {
    this.router.navigate(['item/', itemID]);
  }

  public setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}

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
  public searchText = '';
  order: string = 'rating';
  sortedItems: any[];
  reverse: boolean = true;
  unsortedItems: any[];
  isFiltered: boolean = false;
  byDate: boolean = false;
  byRating: boolean = false;
  byFeatured: boolean = false;

  public constructor(
    private router: Router,
    private itemsService: ItemsService,
    private orderPipe: OrderPipe
  ) { }

  public ngOnInit() {
    localStorage.removeItem('sessionID');
    localStorage.removeItem('itemID');
    this.itemsService.getAllItems().subscribe((res: HttpResponse) => {
      if (res.success) {
        this.items = res.data;
      } else {
        alert(res.message);
      }
      this.unsortedItems = this.items;
    });
  }

  public goToItemDetails(itemID: string): void {
    this.router.navigate(['item/', itemID]);
  }

  // TODO: refactor
  public orderByDate() {
    this.sortedItems = this.orderPipe.transform(
      this.unsortedItems,
      'uploadedDate',
      this.reverse
    );
    if (this.isFiltered === false && this.byDate === false) {
      this.isFiltered = true;
      this.byDate = true;
      this.byFeatured = false;
      this.byRating = false;
    } else if (this.isFiltered === true && this.byDate === false) {
      this.byDate = true;
      this.byFeatured = false;
      this.byRating = false;
    } else {
      this.isFiltered = false;
      this.byDate = false;
    }
  }

  public orderByFeatured() {
    this.sortedItems = this.orderPipe.transform(
      this.unsortedItems,
      'featured',
      this.reverse
    );
    if (this.isFiltered === false && this.byFeatured === false) {
      this.isFiltered = true;
      this.byFeatured = true;
      this.byDate = false;
      this.byRating = false;
    } else if (this.isFiltered === true && this.byFeatured === false) {
      this.byFeatured = true;
      this.byDate = false;
      this.byRating = false;
    } else {
      this.isFiltered = false;
      this.byFeatured = false;
    }
  }

  public orderByRating() {
    this.sortedItems = this.orderPipe.transform(
      this.unsortedItems,
      'rating',
      this.reverse
    );
    if (this.isFiltered === false && this.byRating === false) {
      this.isFiltered = true;
      this.byRating = true;
      this.byFeatured = false;
      this.byDate = false;
    } else if (this.isFiltered === true && this.byRating === false) {
      this.byRating = true;
      this.byFeatured = false;
      this.byDate = false;
    } else {
      this.isFiltered = false;
      this.byRating = false;
    }
  }
}

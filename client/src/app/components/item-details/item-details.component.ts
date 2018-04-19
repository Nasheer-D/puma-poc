import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/Item';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: `app-item-details`,
  templateUrl: `./item-details.component.html`,
  styleUrls: [`./item-details.component.css`]
})
export class ItemDetailsComponent implements OnInit {
  public item: Item = <Item>{};
  private routerSubscription: Subscription;

  public constructor(
    private router: ActivatedRoute,
    private getItemDetails: ItemsService
  ) {}

  public ngOnInit(): void {
    this.routerSubscription = this.router.params.subscribe(params => {
      const itemID = params['itemID'];

      this.getItemDetails
        .getItemByID(itemID)
        .subscribe((response: HttpResponse) => {
          this.item = response.data[0];
        });
    });
  }
}

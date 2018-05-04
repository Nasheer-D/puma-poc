import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Item } from '../../models/Item';
import { TransactionService } from '../../services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../services/items.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { Subscription } from 'rxjs/Subscription';
import { PurchaseOptionsModalComponent } from '../../components/item-details/modals/purchase-options/purchase-options.component';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: `app-item-details`,
  templateUrl: `./item-details.component.html`,
  styleUrls: [`./item-details.component.css`]
})
export class ItemDetailsComponent implements OnInit {
  @ViewChild('purchaseOptionModal')
  public purchaseOptionsModal: PurchaseOptionsModalComponent;
  public item: Item = <Item>{};
  private routerSubscription: Subscription;

  public constructor(
    private router: ActivatedRoute,
    private itemService: ItemsService,
    private web3Service: Web3Service
  ) { }

  public ngOnInit(): void {
    this.routerSubscription = this.router.params.subscribe(params => {
      const itemID = params['itemID'];

      this.itemService
        .getItemByID(itemID)
        .subscribe((response: HttpResponse) => {
          this.item = response.data[0];
          this.item.uploadedDate = this.item.uploadedDate * 1000; // convert timestamp in seconds to milliseconds
        });
    });
  }

  public openPurchaseOptionsModal() {
    this.purchaseOptionsModal.open();
  }
}

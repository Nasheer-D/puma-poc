import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Item } from '../../../../models/Item';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../../../services/items.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsComponent {
  @ViewChild('purchaseOptionModal') purchaseOptionModal: any;
  @Input() itemPrice: number;

  constructor(private modal: NgbModal) {}

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }
}

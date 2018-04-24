import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal') purchaseOptionModal: NgbModal;
  @Input() itemPrice: number;

  constructor(private modal: NgbModal) {}

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }
}

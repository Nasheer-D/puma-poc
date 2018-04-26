import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../services/transaction.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal') purchaseOptionModal: NgbModal;
  @Input() itemPrice: number;
  @Input() itemID: string;

  constructor(private modal: NgbModal,
    private transactionService: TransactionService) { }

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }

  public getQrCodeForMobile(): void {
    this.transactionService.getTransactionData(this.itemID).subscribe((httpResonse: HttpResponse) => {
      console.log(httpResonse);
    });
  }
}

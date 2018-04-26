import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../services/transaction.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TransactionData } from '../../../../models/Transaction';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal') purchaseOptionModal: NgbModal;
  @Input() itemPrice: number;
  @Input() itemID: string;
  private txData: TransactionData;

  constructor(private modal: NgbModal,
    private transactionService: TransactionService) { }

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }

  public getQrCodeForMobile(): void {
  }

  private getTxData(): void {
    this.transactionService.getTransactionData(this.itemID).subscribe((httpResonse: HttpResponse) => {
      localStorage.setItem('sessionID', httpResonse.sessionID);
      this.txData = httpResonse.data[0];
    });
  }
}

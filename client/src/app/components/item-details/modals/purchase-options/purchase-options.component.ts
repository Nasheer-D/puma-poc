import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../services/transaction.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TransactionData } from '../../../../models/Transaction';
import { PaymentWalletModalComponent } from '../payment-wallet/payment-wallet.component';
import { Constants } from '../../../../app.constants';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal')
  public purchaseOptionModal: NgbModal;
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: PaymentWalletModalComponent;

  @Input() itemPrice: number;
  @Input() itemID: string;

  private txData: TransactionData;
  public txDataAsString: any;

  constructor(private modal: NgbModal,
    private transactionService: TransactionService) { }

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }

  public openPaymentWalletModal(): void {
    this.transactionService.getTransactionData(this.itemID).subscribe((httpResonse: HttpResponse) => {
      localStorage.setItem('sessionID', httpResonse.sessionID);
      this.txDataAsString = JSON.stringify(
        { url: `${Constants.serverHost}${Constants.apiPrefix}transaction/wallet/tx/${httpResonse.sessionID}/${this.itemID}` });
      this.paymentWalletModal.open();
    });
  }
}

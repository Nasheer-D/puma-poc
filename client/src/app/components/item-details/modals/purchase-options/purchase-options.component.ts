import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '../../../../services/transaction.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TransactionData } from '../../../../models/Transaction';
import { PaymentWalletModalComponent } from '../payment-wallet/payment-wallet.component';
import { Constants } from '../../../../app.constants';
import { PaymentMetamaskComponent } from '../payment-metamask/payment-metamask.component';


@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent implements OnInit {
  @ViewChild('purchaseOptionModal')
  public purchaseOptionModal: NgbModal;
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: PaymentWalletModalComponent;

  @ViewChild('paymentMetamaskModal')
  public paymentMetamaskModal: PaymentMetamaskComponent;

  @Input() itemPrice: number;
  @Input() itemID: string;

  public txData: TransactionData;
  public txDataAsString: any;
  private sessionID: string;

  public constructor(private modal: NgbModal,
    private transactionService: TransactionService) {
    this.sessionID = localStorage.getItem('sessionID');
  }

  public ngOnInit(): void {
    this.txDataAsString = JSON.stringify(
      { url: `${Constants.serverHost}${Constants.apiPrefix}transaction/tx/plain/${this.sessionID}/${this.itemID}` });
  }

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }

  public openPaymentWalletModal(): void {
    this.paymentWalletModal.open();
  }

  public openPaymentMetamaskModal(): void {
    this.paymentMetamaskModal.open();
  }
}

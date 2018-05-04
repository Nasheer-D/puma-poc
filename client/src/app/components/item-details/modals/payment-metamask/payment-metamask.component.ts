import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { TxStatusService } from '../../../../services/webSocket.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TxStatus, TransactionData } from '../../../../models/Transaction';
import { Web3Service } from '../../../../services/web3.service';
import { TransactionService } from '../../../../services/transaction.service';

@Component({
  selector: 'app-payment-metamask',
  templateUrl: './payment-metamask.component.html',
  styleUrls: ['./payment-metamask.component.css']
})
export class PaymentMetamaskComponent {

  @ViewChild('paymentMetamaskModal')
  public paymentMetamaskModal: NgbModal;
  @Input()
  public itemPrice: number;
  @Input()
  public txData: TransactionData;
  public sessionTransaction: any = {};
  public txStatus: TxStatus;
  private sessionID: string;

  constructor(private modal: NgbModal,
    private spinner: NgxSpinnerService,
    private txStatusService: TxStatusService,
    private web3Service: Web3Service,
    private transactionService: TransactionService) {
  }

  public open(): void {
    this.sessionTransaction.status = -1;
    this.sessionID = localStorage.getItem('sessionID');
    this.txStatusService.onTxStatusChange(this.sessionID).subscribe((response: HttpResponse) => {
      if (response.success) {
        this.sessionTransaction = response.data[0];
      }
    });
    this.modal.open(this.paymentMetamaskModal, { centered: true, size: 'lg' });
  }

  public get hasMetamask(): boolean {
    return this.web3Service.hasMetaMask;
  }

  public buyWithMetaMask(): void {
    if (!this.web3Service.hasMetaMask) {
      console.log('No Metamask Injected - Please download metamask');
      alert('No Metamask Injected - Please download metamask');
      return;
    }

    this.transactionService.sendTransactionStatus(this.sessionID, '', 0).subscribe(st => {
      console.log(st);
      console.log(this.txData);
      this.web3Service.sentTransaction(this.txData.to, this.txData.value).catch(err => {
        console.log(err);
        this.transactionService.sendTransactionStatus(this.sessionID, '', 4).subscribe();
        return Observable.of(null);
      }).subscribe(tx => {
        console.log(tx);
        this.transactionService.sendTransactionStatus(this.sessionID, tx, 1).subscribe();
        const receiptSub = this.web3Service.getTransactionStatus(tx).subscribe(receipt => {
          if (receipt != null) {
            receiptSub.unsubscribe();
            // tslint:disable-next-line:triple-equals
            if (receipt.status == 1) {
              this.transactionService.sendTransactionStatus(this.sessionID, tx, 2).subscribe();
            } else {
              this.transactionService.sendTransactionStatus(this.sessionID, tx, 3).subscribe();
            }
          }
        });
      });
    });
  }

  public isInactiveRequest(): boolean {
    return this.sessionTransaction.status === -1;
  }

  public isPendingRequest(): boolean {
    return this.sessionTransaction.status === 0;
  }

  public isClosedRequest(): boolean {
    return this.sessionTransaction.status !== -1 && this.sessionTransaction.status !== 0;
  }

  public isInactiveResponse(): boolean {
    return this.sessionTransaction.status === -1 || this.sessionTransaction.status === 0;
  }

  public isPendingResponse(): boolean {
    return this.sessionTransaction.status === 1;
  }

  public isClosedResponse(): boolean {
    return this.sessionTransaction.status !== -1 && this.sessionTransaction.status !== 0 && this.sessionTransaction.status !== 1;
  }

  public isInactiveStatus(): boolean {
    return this.sessionTransaction.status === -1 || this.sessionTransaction.status === 0 || this.sessionTransaction.status === 1;
  }

  public isPendingStatus(): boolean {
    return this.sessionTransaction.status === 2;
  }

  public isSucccessfulStatus(): boolean {
    return this.sessionTransaction.status === 2;
  }

  public isFailedStatus(): boolean {
    return this.sessionTransaction.status === 3;
  }

  public isCancelledStatus(): boolean {
    return this.sessionTransaction.status === 4;
  }
}

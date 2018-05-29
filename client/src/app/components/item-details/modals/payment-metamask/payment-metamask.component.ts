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
import { UserService } from '../../../../services/users.service';

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
  public packagePrice: number;
  public txData: TransactionData;
  public sessionTransaction: any = {};
  public txStatus: TxStatus;
  private userID: string;
  private sessionID: string;
  private itemID: string;
  private packageID: string;
  private credits: string;


  constructor(private modal: NgbModal,
    private spinner: NgxSpinnerService,
    private txStatusService: TxStatusService,
    private web3Service: Web3Service,
    private transactionService: TransactionService,
    private userService: UserService) {
  }

  public open(): void {
    // status is -1(not enable the transaction) and get the item with the sessionID
    // TODO: Get transaction session status from API
    this.sessionTransaction.status = -1;
    this.sessionID = localStorage.getItem('sessionID');
    if (this.itemPrice) {
      this.itemID = localStorage.getItem('itemID');
      // get the tx details of the specific item
      this.transactionService.getTxDetailsForItem(this.sessionID, this.itemID).subscribe((response: HttpResponse) => {
        // if response is successful,get the tx data
        if (response.success) {
          // get the tx status change
          this.txData = response.data[0];
        }
        this.txStatusService.onTxStatusChange(this.sessionID).subscribe((res: HttpResponse) => {
          // if response is successful,get the tx session
          if (response.success) {
            this.sessionTransaction = res.data[0];
          }
        });
      });
    } else if (this.packagePrice) {
      this.packageID = localStorage.getItem('packageID');
      this.userID = JSON.parse(localStorage.getItem('currentUser')).userID;
      // get the tx details of the specific item
      this.transactionService.getTxDetailsForPackage(this.sessionID, this.packageID).subscribe((txResponse: HttpResponse) => {
        // if response is successful,get the tx data
        if (txResponse.success) {
          // get the tx status change
          this.txData = txResponse.data[0];
        }
        this.txStatusService.onTxStatusChange(this.sessionID).subscribe((statusResponse: HttpResponse) => {
          // if response is successful,get the tx session
          if (statusResponse.success) {
            this.sessionTransaction = statusResponse.data[0];
            if (this.isSucccessfulStatus()) {
              this.userService.getLoggedInUserCredits().subscribe((creditResponse: HttpResponse) => {
                if (creditResponse.success) {
                  const user = JSON.parse(localStorage.getItem('currentUser'));
                  user.credits = creditResponse.data[0].credits;
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  // TODO - Reload in the proper way
                  window.location.reload();
                }
              });
            }
          }
        });
      });
    }

    this.modal.open(this.paymentMetamaskModal, { centered: true, size: 'lg' });
  }

  // check if metamask exist
  public get hasMetamask(): boolean {
    return this.web3Service.hasMetaMask;
  }

  public buyWithMetaMask(): void {
    // if metamask doesnt exist show a message to download the metamask
    if (!this.hasMetamask) {
      console.log('No Metamask Injected - Please download metamask');
      return;
    }
    if (this.itemPrice) {
      // for tx status equal to 0 send the transaction
      this.transactionService.sendTransactionStatusForItem(this.sessionID, '', 0).subscribe(st => {
        this.web3Service.sentTransaction(this.txData.to, this.txData.value).catch(err => {
          // for tx status equal to 4 cancel the transaction
          this.transactionService.sendTransactionStatusForItem(this.sessionID, '', 4).subscribe();
          return Observable.of();
        }).subscribe(tx => {
          // for tx status equal to 1 get the receipt
          this.transactionService.sendTransactionStatusForItem(this.sessionID, tx, 1).subscribe();
          const receiptSub = this.web3Service.getTransactionStatus(tx).subscribe(receipt => {
            if (receipt != null) {
              receiptSub.unsubscribe();
              // if receipt.status equal to 1, set tx status to 1 otherwise set it to 3
              // tslint:disable-next-line:triple-equals
              if (receipt.status == 1) {
                this.transactionService.sendTransactionStatusForItem(this.sessionID, tx, 2).subscribe();
              } else {
                this.transactionService.sendTransactionStatusForItem(this.sessionID, tx, 3).subscribe();
              }
            }
          });
        });
      });
    } else if (this.packagePrice) {
      // for tx status equal to 0 send the transaction
      this.transactionService.sendTransactionStatusForPackage(this.packageID, this.userID, this.sessionID, '', 0).subscribe(st => {
        this.web3Service.sentTransaction(this.txData.to, this.txData.value).catch(err => {
          // for tx status equal to 4 cancel the transaction
          this.transactionService.sendTransactionStatusForPackage(this.packageID, this.userID, this.sessionID, '', 4).subscribe();
          return Observable.of();
        }).subscribe(tx => {
          // for tx status equal to 1 get the receipt
          this.transactionService.sendTransactionStatusForPackage(this.packageID, this.userID, this.sessionID, tx, 1).subscribe();
          const receiptSub = this.web3Service.getTransactionStatus(tx).subscribe(receipt => {
            if (receipt != null) {
              receiptSub.unsubscribe();
              // if receipt.status equal to 1, set tx status to 1 otherwise set it to 3
              // tslint:disable-next-line:triple-equals
              if (receipt.status == 1) {
                this.transactionService.sendTransactionStatusForPackage(this.packageID, this.userID, this.sessionID, tx, 2).subscribe();
              } else {
                this.transactionService.sendTransactionStatusForPackage(this.packageID, this.userID, this.sessionID, tx, 3).subscribe();
              }
            }
          });
        });
      });
    }
  }
  // the following functions change their values according to the status received from the
  // webSocket to display the transaction progress to the client
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

import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { TxStatusService } from '../../../../services/webSocket.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TxStatus } from '../../../../models/Transaction';
import { QrGeneratorService } from '../../../../services/qr-generator.service';
import { UserService } from '../../../../services/users.service';

@Component({
  selector: 'app-payment-wallet',
  templateUrl: './payment-wallet.component.html',
  styleUrls: ['./payment-wallet.component.css']
})
export class PaymentWalletModalComponent {
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: NgbModal;
  @Input()
  public itemPrice: number;
  @Input()
  public packagePrice: number;
  public txDataAsString: string;
  public sessionTransaction: any = {};
  private sessionID: string;
  private credits: string;

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService,
    private txStatusService: TxStatusService,
    private qrGeneratorService: QrGeneratorService,
    private userService: UserService) {
  }

  public open(): void {
    // status is -1(not enable the transaction) and get the item with the sessionID
    this.sessionTransaction.status = -1;
    const sessionID = localStorage.getItem('sessionID');
    if (this.itemPrice) {
      this.txDataAsString = this.qrGeneratorService.getQrDataForItem();
    } else if (this.packagePrice) {
      this.txDataAsString = this.qrGeneratorService.getQrDataForPackage();
    }
    this.txStatusService.onTxStatusChange(sessionID).subscribe((response: HttpResponse) => {
      if (response.success) {
        this.sessionTransaction = response.data[0];
        if (this.isSucccessfulStatus() && this.packagePrice) {
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
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
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

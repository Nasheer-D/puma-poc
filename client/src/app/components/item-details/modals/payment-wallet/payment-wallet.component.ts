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
  public txDataAsString: string;
  public sessionTransaction: any = {};
  private sessionID: string;

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService,
    private txStatusService: TxStatusService,
    private qrGeneratorService: QrGeneratorService) {
  }

  public open(): void {
    this.sessionTransaction.status = -1;
    const sessionID = localStorage.getItem('sessionID');
    this.generateQr();
    this.txStatusService.onTxStatusChange(sessionID).subscribe((response: HttpResponse) => {
      if (response.success) {
        this.sessionTransaction = response.data[0];
      }
    });
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }

  public generateQr(): any {
    this.txDataAsString = this.qrGeneratorService.getQrData(localStorage.getItem('sessionID'), localStorage.getItem('itemID'));
    console.log('This is a string', this.txDataAsString);
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

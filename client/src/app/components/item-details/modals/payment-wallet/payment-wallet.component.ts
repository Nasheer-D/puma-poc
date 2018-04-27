import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TxStatusService } from '../../../../services/webSocket.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { TxStatus } from '../../../../models/Transaction';

@Component({
  selector: 'app-payment-wallet',
  templateUrl: './payment-wallet.component.html',
  styleUrls: ['./payment-wallet.component.css']
})
export class PaymentWalletModalComponent implements OnInit {
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: NgbModal;
  @Input()
  public itemPrice: number;
  @Input()
  public txDataAsString: string;
  public sessionTransaction: any = {};
  public txStatus: TxStatus;

  disableElements: boolean;

  @Input() activeRequest: boolean; // Request Container color
  @Input() activeResponse: boolean; // Response Container color
  @Input() activeStatus: boolean; // Status Container color
  @Input() completedRequest: number; // [0,1,2] Pending,Loading,Success => Request
  @Input() completedResponse: number; // [0,1,2] Pending, Loading, Success => Response
  @Input() completedStatus: number; // [0,1,2,3] Pending, Loading, Success, Failed => Status

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService,
    private txStatusService: TxStatusService) {

  }

  public ngOnInit(): void {
    this.sessionTransaction.status = 0;
    this.txStatusService.onTxStatusChange().subscribe((response: HttpResponse) => {
      console.log(response);
      if (response.success) {
        this.sessionTransaction = response.data[0];
      }
      console.log(this.sessionTransaction.status);
    });
  }

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }

  public isInactiveRequest(): boolean {
    return this.sessionTransaction.status === 0;
  }

  public isPendingRequest(): boolean {
    return this.sessionTransaction.status === 1;
  }

  public isClosedRequest(): boolean {
    return this.sessionTransaction.status !== 0 && this.sessionTransaction.status !== 1;
  }

  public isInactiveResponse(): boolean {
    return this.sessionTransaction.status === 0 || this.sessionTransaction.status === 1;
  }

  public isPendingResponse(): boolean {
    return this.sessionTransaction.status === 2;
  }

  public isClosedResponse(): boolean {
    return this.sessionTransaction.status !== 0 && this.sessionTransaction.status !== 1 && this.sessionTransaction.status !== 2;
  }

  public isInactiveStatus(): boolean {
    return this.sessionTransaction.status === 0 || this.sessionTransaction.status === 1 || this.sessionTransaction.status === 2;
  }

  public isPendingStatus(): boolean {
    return this.sessionTransaction.status === 3;
  }

  public isSucccessfulStatus(): boolean {
    return this.sessionTransaction.status === 4;
  }

  public isFailedStatus(): boolean {
    return this.sessionTransaction.status === 5;
  }
}

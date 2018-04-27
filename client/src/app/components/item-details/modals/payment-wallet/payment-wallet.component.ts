import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment-wallet',
  templateUrl: './payment-wallet.component.html',
  styleUrls: ['./payment-wallet.component.css']
})
export class PaymentWalletComponent implements OnInit {
  @ViewChild('paymentWalletModal') paymentWalletModal: NgbModal;
  @Input() itemPrice2: number;
  disableElements: boolean;

  @Input() activeRequest: boolean; // Request Container color
  @Input() activeResponse: boolean; // Response Container color
  @Input() activeStatus: boolean; // Status Container color
  @Input() completedRequest: number; // [0,1,2] Pending,Loading,Success => Request
  @Input() completedResponse: number; // [0,1,2] Pending, Loading, Success => Response
  @Input() completedStatus: number; // [0,1,2,3] Pending, Loading, Success, Failed => Status

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService) {
    this.activeRequest = false;
    this.activeResponse = false;
    this.activeStatus = false;
    this.disableElements = null;
    this.completedRequest = 0;
    this.completedResponse = 0;
    this.completedStatus = 0;
  }

  ngOnInit() {
    setTimeout(() => {
      // Request
      this.disableElements = true;
      this.activeRequest = true;
      this.completedRequest = 1;
      setTimeout(() => {
        // Response
        this.completedRequest = 2;
        this.activeResponse = true;
        this.completedResponse = 1;
        setTimeout(() => {
          // Status
          this.completedResponse = 2;
          this.activeStatus = true;
          this.completedStatus = 1;
          setTimeout(() => {
            this.completedStatus = 2;
            this.disableElements = null;
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  }

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }
}

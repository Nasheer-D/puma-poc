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

  @Input() activeRequest: boolean;
  @Input() activeResponse: boolean;
  @Input() activeStatus: boolean;
  @Input() completedRequest: number;
  @Input() completedResponse: number;
  @Input() completedStatus: number;

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService) {
    // this.disableElements = null;
    this.activeRequest = false;
    this.activeResponse = false;
    this.activeStatus = false;
    this.disableElements = true;
  }

  ngOnInit() {
    // this.spinner.show();

    setTimeout(() => {
      this.disableElements = true;
      this.activeRequest = true;
  
      // this.spinner.hide();
      setTimeout(() => {
        this.activeResponse = true;
        this.disableElements = true;
        // this.spinner.hide();
        setTimeout(() => {
          this.activeStatus = true;
          this.disableElements = null;
          // this.spinner.hide();
        }, 5000);
      }, 5000);
    }, 5000);
  }

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }
}

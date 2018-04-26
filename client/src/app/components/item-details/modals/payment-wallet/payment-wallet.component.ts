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

  activeRequest: boolean;
  completedRequest: number;

  activeResponse: boolean;
  completedResponse: number;

  activeStatus: boolean;
  completedStatus: number;

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService) {
    this.disableElements = true;
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      setTimeout(() => {
        this.spinner.hide();
        setTimeout(() => {
          this.spinner.hide();
          this.disableElements = null;
        }, 5000);
      }, 5000);
    }, 5000);
  }

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }
}

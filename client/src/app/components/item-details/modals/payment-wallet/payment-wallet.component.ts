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
    this.activeRequest = false;
    this.activeResponse = false;
    this.activeStatus = false;
    this.disableElements = true;
  }

  ngOnInit() {
    setTimeout(() => {
      this.disableElements = true;
      this.activeRequest = true;

      setTimeout(() => {
        this.activeResponse = true;
        this.disableElements = true;

        setTimeout(() => {
          this.activeStatus = true;

          setTimeout(() => {
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

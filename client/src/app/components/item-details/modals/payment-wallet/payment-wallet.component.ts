import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
  disableElements: boolean;

  public activeRequest: boolean;
  public activeResponse: boolean;
  public activeStatus: boolean;

  public completedRequest: number;
  public completedResponse: number;
  public completedStatus: number;

  constructor(private modal: NgbModal, private spinner: NgxSpinnerService) {
    this.disableElements = null;
    // this.activeRequest = false;
    // this.activeResponse = false;
    // this.activeStatus = false;
  }

  public ngOnInit(): void {

    setTimeout(() => {
      // this.disableElements = true;
      this.activeRequest = true;
      this.activeResponse = true;
      this.activeStatus = true;
      this.spinner.hide();
      setTimeout(() => {
        this.spinner.hide();
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      }, 5000);
    }, 5000);
  }

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }
}

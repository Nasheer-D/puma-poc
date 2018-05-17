import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWalletModalComponent } from './payment-wallet.component';

describe('PaymentWalletComponent', () => {
  let component: PaymentWalletModalComponent;
  let fixture: ComponentFixture<PaymentWalletModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentWalletModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

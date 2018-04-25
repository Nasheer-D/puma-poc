import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWalletComponent } from './payment-wallet.component';

describe('PaymentWalletComponent', () => {
  let component: PaymentWalletComponent;
  let fixture: ComponentFixture<PaymentWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

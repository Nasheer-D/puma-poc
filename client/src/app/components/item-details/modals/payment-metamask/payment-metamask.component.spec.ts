import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMetamaskComponent } from './payment-metamask.component';

describe('PaymentMetamaskComponent', () => {
  let component: PaymentMetamaskComponent;
  let fixture: ComponentFixture<PaymentMetamaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMetamaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMetamaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

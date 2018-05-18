import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceActivityComponent } from './account-balance-activity.component';

describe('AccountBalanceActivityComponent', () => {
  let component: AccountBalanceActivityComponent;
  let fixture: ComponentFixture<AccountBalanceActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBalanceActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBalanceActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

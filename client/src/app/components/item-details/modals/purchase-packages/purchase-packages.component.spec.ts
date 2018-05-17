import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePackagesComponent } from './purchase-packages.component';

describe('PurchasePackagesComponent', () => {
  let component: PurchasePackagesComponent;
  let fixture: ComponentFixture<PurchasePackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

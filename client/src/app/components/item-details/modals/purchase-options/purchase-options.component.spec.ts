import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseOptionsModalComponent } from './purchase-options.component';

describe('PurchaseOptionsComponent', () => {
  let component: PurchaseOptionsModalComponent;
  let fixture: ComponentFixture<PurchaseOptionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseOptionsModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

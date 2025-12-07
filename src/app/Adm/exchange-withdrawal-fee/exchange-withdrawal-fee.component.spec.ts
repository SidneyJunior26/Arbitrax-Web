import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeWithdrawalFeeComponent } from './exchange-withdrawal-fee.component';

describe('ExchangeWithdrawalFeeComponent', () => {
  let component: ExchangeWithdrawalFeeComponent;
  let fixture: ComponentFixture<ExchangeWithdrawalFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeWithdrawalFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeWithdrawalFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

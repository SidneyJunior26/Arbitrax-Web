import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawFeeComponent } from './withdraw-fee.component';

describe('WithdrawFeeComponent', () => {
  let component: WithdrawFeeComponent;
  let fixture: ComponentFixture<WithdrawFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

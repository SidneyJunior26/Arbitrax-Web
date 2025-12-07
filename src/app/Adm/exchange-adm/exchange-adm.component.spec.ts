import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeAdmComponent } from './exchange-adm.component';

describe('ExchangeAdmComponent', () => {
  let component: ExchangeAdmComponent;
  let fixture: ComponentFixture<ExchangeAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

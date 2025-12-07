import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoAdmComponent } from './crypto-adm.component';

describe('CryptoAdmComponent', () => {
  let component: CryptoAdmComponent;
  let fixture: ComponentFixture<CryptoAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

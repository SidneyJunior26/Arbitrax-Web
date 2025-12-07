import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigOpportunityComponent } from './config-opportunity.component';

describe('ConfigAdmComponent', () => {
  let component: ConfigOpportunityComponent;
  let fixture: ComponentFixture<ConfigOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigOpportunityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

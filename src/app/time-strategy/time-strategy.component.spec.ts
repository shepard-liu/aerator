import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeStrategyComponent } from './time-strategy.component';

describe('TimeStrategyComponent', () => {
  let component: TimeStrategyComponent;
  let fixture: ComponentFixture<TimeStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

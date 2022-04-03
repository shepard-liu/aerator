import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelledFieldComponent } from './labelled-field.component';

describe('LabelledFieldComponent', () => {
  let component: LabelledFieldComponent;
  let fixture: ComponentFixture<LabelledFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelledFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelledFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

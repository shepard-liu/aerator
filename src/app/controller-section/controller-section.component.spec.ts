import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerSectionComponent } from './controller-section.component';

describe('ControllerSectionComponent', () => {
  let component: ControllerSectionComponent;
  let fixture: ComponentFixture<ControllerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllerSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

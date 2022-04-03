import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AeratorControlComponent } from './aerator-control.component';

describe('AeratorControlComponent', () => {
  let component: AeratorControlComponent;
  let fixture: ComponentFixture<AeratorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AeratorControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AeratorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

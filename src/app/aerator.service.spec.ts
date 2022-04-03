import { TestBed } from '@angular/core/testing';

import { AeratorService } from './aerator.service';

describe('AeratorService', () => {
  let service: AeratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AeratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

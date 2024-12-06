import { TestBed } from '@angular/core/testing';

import { AffectationsService } from './affectations.service';

describe('AffectationsService', () => {
  let service: AffectationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffectationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

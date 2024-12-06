import { TestBed } from '@angular/core/testing';

import { AmenagementService } from './amenagement.service';

describe('AmenagementService', () => {
  let service: AmenagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmenagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

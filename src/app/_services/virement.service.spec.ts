import { TestBed } from '@angular/core/testing';

import { VirementService } from './virement.service';

describe('VirementService', () => {
  let service: VirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

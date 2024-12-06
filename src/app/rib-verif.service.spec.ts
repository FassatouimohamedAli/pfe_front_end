import { TestBed } from '@angular/core/testing';

import { RibVerifService } from './rib-verif.service';

describe('RibVerifService', () => {
  let service: RibVerifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RibVerifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

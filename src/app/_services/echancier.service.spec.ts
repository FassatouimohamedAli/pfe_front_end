import { TestBed } from '@angular/core/testing';

import { EchancierService } from './echancier.service';

describe('EchancierService', () => {
  let service: EchancierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchancierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OperationRecouvrementService } from './operation-recouvrement.service';

describe('OperationRecouvrementService', () => {
  let service: OperationRecouvrementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationRecouvrementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

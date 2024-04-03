import { TestBed } from '@angular/core/testing';

import { HMFormService } from './hmform.service';

describe('HMFormService', () => {
  let service: HMFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HMFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

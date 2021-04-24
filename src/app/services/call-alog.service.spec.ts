import { TestBed } from '@angular/core/testing';

import { CallAlogService } from './call-alog.service';

describe('CallAlogService', () => {
  let service: CallAlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallAlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

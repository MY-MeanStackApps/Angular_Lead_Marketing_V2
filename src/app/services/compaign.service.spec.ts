import { TestBed } from '@angular/core/testing';

import { CompaignService } from './compaign.service';

describe('CompaignService', () => {
  let service: CompaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

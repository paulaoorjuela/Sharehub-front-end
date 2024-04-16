import { TestBed } from '@angular/core/testing';

import { SharehubApiService } from './sharehub-api.service';

describe('SharehubApiService', () => {
  let service: SharehubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharehubApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

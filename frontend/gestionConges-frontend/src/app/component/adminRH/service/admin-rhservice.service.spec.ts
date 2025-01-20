import { TestBed } from '@angular/core/testing';

import { AdminRHServiceService } from './admin-rhservice.service';

describe('AdminRHServiceService', () => {
  let service: AdminRHServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRHServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

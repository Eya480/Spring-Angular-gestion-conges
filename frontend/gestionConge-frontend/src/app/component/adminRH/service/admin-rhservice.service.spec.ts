import { TestBed } from '@angular/core/testing';

import { AdminRHserviceService } from './admin-rhservice.service';

describe('AdminRHserviceService', () => {
  let service: AdminRHserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRHserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

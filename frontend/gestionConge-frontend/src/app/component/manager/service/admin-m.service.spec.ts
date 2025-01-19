import { TestBed } from '@angular/core/testing';

import { AdminMService } from './admin-m.service';

describe('AdminMService', () => {
  let service: AdminMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

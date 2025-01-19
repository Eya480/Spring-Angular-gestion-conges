import { TestBed } from '@angular/core/testing';

import { AdminEmpService } from './admin-emp.service';

describe('AdminEmpService', () => {
  let service: AdminEmpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEmpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

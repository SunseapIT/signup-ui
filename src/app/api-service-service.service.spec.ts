import { TestBed } from '@angular/core/testing';

import { ApiServiceServiceService } from './api-service-service.service';

describe('ApiServiceServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiServiceServiceService = TestBed.get(ApiServiceServiceService);
    expect(service).toBeTruthy();
  });
});

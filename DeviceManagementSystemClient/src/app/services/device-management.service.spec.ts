import { TestBed } from '@angular/core/testing';

import { DeviceManagementService } from './device-management.service';

describe('DeviceManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceManagementService = TestBed.get(DeviceManagementService);
    expect(service).toBeTruthy();
  });
});

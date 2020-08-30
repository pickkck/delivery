import { TestBed, async, inject } from '@angular/core/testing';

import { LogGuardGuard } from './log-guard.guard';

describe('LogGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogGuardGuard]
    });
  });

  it('should ...', inject([LogGuardGuard], (guard: LogGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});

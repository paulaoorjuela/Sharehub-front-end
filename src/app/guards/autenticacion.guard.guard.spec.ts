import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { autenticacionGuardGuard } from './autenticacion.guard.guard';

describe('autenticacionGuardGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => autenticacionGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

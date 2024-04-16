import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { SharehubApiService } from '../services/sharehub-api.service';

export const autenticacionGuardGuard: CanMatchFn = (route, segments) => {

    const Sharehub = inject(SharehubApiService)
    return Sharehub.estaLogueado()



};

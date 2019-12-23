import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.afAuth.user.pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/auth']);
        }
        return !!user;
      }),
    );
  }
}

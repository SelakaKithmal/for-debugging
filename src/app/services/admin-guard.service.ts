import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private afa: AngularFireAuth, private snack: MatSnackBar) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return this.afa.auth.currentUser.getIdTokenResult().then((idTokenResult) => {
      if (
        idTokenResult.claims.admin ||
        idTokenResult.claims.care ||
        idTokenResult.claims.sale
      ) {
        return true;
      } else {
        this.snack.open('You are not allowed to see this page', 'Close', {
          duration: 7000,
        });
        return false;
      }
    });
  }
}

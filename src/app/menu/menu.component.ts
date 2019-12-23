import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public opened = false;
  public over = 'over';
  public expandHeight = '42px';
  public collapseHeight = '42px';
  public displayMode = 'flat';

  public isLoggedIn: boolean;
  public user: any;

  public isAdmin: boolean;
  public isSales: boolean;
  public isCare: boolean;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
  ) {}

  public ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  public logout() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('lead');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth']);
  }
}

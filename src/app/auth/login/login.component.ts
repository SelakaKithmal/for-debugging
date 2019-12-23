import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  busy: boolean;
  email: string;
  password: string;
  hide: boolean;

  constructor(
    private af: AngularFireAuth,
    private snack: MatSnackBar,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit(formData) {
    this.busy = true;
    this.af.auth
      .signInWithEmailAndPassword(formData.email, formData.password)
      .then(res => {
        this.busy = false;
        this.snack.open('Login Successful, Welcome Back!', 'Close', {
          duration: 5000
        });
        this.afs.collection('users').doc(this.af.auth.currentUser.uid)
          .valueChanges()
          .subscribe(lead => {
            localStorage.setItem('lead', JSON.stringify(lead));
            this.router.navigate(['/']);
          });
      })
      .catch(err => {
        this.busy = false;
        this.snack.open(err.message, 'Close', {
          duration: 5000
        });
      });
  }
}

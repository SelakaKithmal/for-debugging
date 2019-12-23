import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { VerifyphoneComponent } from "../verifyphone/verifyphone.component";
import * as firebase from "firebase/app";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  busy: boolean;
  phone: string;
  email: string;
  password: string;
  confirmpassword: string;
  name: string;
  hide: boolean;
  country: string;
  showVerifyBox: boolean;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  formError: boolean;

  numberPrefix = "+233";

  constructor(
    private af: AngularFireAuth,
    private router: Router,
    private snack: MatSnackBar,
    private afs: AngularFirestore,
    private bottomSheet: MatBottomSheet,
    private changeRef: ChangeDetectorRef,
    private func: AngularFireFunctions
  ) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible"
      }
    );
  }

  // This is necessary so as to prevent this scenario
  // Person clicks on referral link
  // Person Continues to register
  // Person already has an account, so continues to Login
  // At that point, the referral code is still in local storage
  // Which ends up being re-used after login
  clearReferral() {
    localStorage.removeItem("referral");
  }

  async onSubmit(formData) {
    if (formData.password !== formData.confirmpassword) {
      this.snack.open("Passwords do not match", "Close");
      return;
    }

    this.showVerifyBox = true;

    formData.phone = this.numberPrefix + formData.phone.substring(1);

    this.busy = true;

    // With phone authentication
    firebase
      .auth()
      // send text message to user
      .signInWithPhoneNumber(formData.phone, this.recaptchaVerifier)
      .then(confirmationResult => {
        // bring up bottomsheet
        const dialogRef = this.bottomSheet.open(VerifyphoneComponent, {
          // disableClose: true,
          closeOnNavigation: true
        });

        /*
         * receive user action, confirm with firebase
         * proceed to update details in firestore.
         *
         */
        dialogRef.afterDismissed().subscribe(result => {
          console.log(result);
          if (result) {
            confirmationResult.confirm(result).then(good => {
              console.log(good);
              // call the registeration part
              this.af.auth
                .createUserWithEmailAndPassword(
                  formData.email,
                  formData.password
                )
                .then(res => {
                  this.busy = false;
                  // res.user.sendEmailVerification();
                  const code = Math.random()
                    .toString(36)
                    .substring(7);
                  this.afs
                    .collection("users")
                    .doc(res.user.uid)
                    .set({
                      email: formData.email,
                      name: formData.name,
                      phone: formData.phone,
                      country: formData.country,
                      phone_verified: true,
                      referralCode: code,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(profile => {
                      // Create wallet
                      this.afs
                        .collection("wallet")
                        .doc(res.user.uid)
                        .set({
                          credit: 50,
                          createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                      // snack notification
                      this.snack.open(
                        "Registration complete. Check email for verification",
                        "Close",
                        {
                          duration: 5000
                        }
                      );
                      // trigger welcome email
                      formData.referralCode = code;
                      const triggerWelcome = this.func.httpsCallable(
                        "sendWelcomeEmail"
                      );
                      triggerWelcome(formData).subscribe(
                        triggerRes => {
                          console.log(triggerRes);
                        },
                        err => {
                          console.log(err);
                        }
                      );

                      // sign in again then redirect
                      this.af.auth
                        .signInWithEmailAndPassword(
                          formData.email,
                          formData.password
                        )
                        .then(user => {
                          if (user) {
                            this.afs
                              .collection("users")
                              .doc(user.user.uid)
                              .valueChanges()
                              .subscribe(lead => {
                                localStorage.setItem(
                                  "lead",
                                  JSON.stringify(lead)
                                );
                                this.router.navigate(["/"]);
                              });
                          } else {
                            this.snack.open("Something is wrong", "Close");
                          }
                        })
                        .catch(err => {
                          this.busy = false;
                          console.log(err);
                          this.snack.open(err.message, "Close");
                        });
                    })
                    .catch(err => {
                      this.busy = false;
                      console.log(err);
                      this.snack.open(err.message, "Close");
                    });
                })
                .catch(err => {
                  this.busy = false;
                  console.log(err);
                  this.snack.open(err.message, "Close")
                  // .afterDismissed().subscribe(_ => {
                  //   location.reload();
                  // })
                });
            });
          } else {
            this.busy = false;
            this.snack.open(
              "Phone verification couldn't happen. Try again",
              "Close"
            );
          }
        });
      })
      .catch(err => {
        console.log(err);
        this.snack.open(err.message, "Close");
      });
  }
}

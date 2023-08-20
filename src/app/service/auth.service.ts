import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable , BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  email!: BehaviorSubject<string>;
  logedInStatus!: BehaviorSubject<boolean>;
  logedGuard!: boolean;
  constructor(private afAuth: AngularFireAuth, private toastr: ToastrService, private router: Router) {
    this.email = new BehaviorSubject("");
    this.logedInStatus = new BehaviorSubject(false);
    this.logedGuard = false;
  }

  login(email: string, password: string):void {
    this.afAuth.signInWithEmailAndPassword(email, password).then((data) => {
      this.loadUser();
      this.logedInStatus.next(true);
      this.logedGuard = true;
      this.toastr.success('Login In Successfuly.....');
      this.router.navigate(["/"])
    }).catch(err => {
      this.toastr.warning(err);
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success('User Logged Out Successfuly.....');
      this.logedInStatus.next(false);
      this.logedGuard = false;
      this.router.navigate(['/login']);
    })
  }

  loadUser(){
    this.afAuth.authState.subscribe({
      next: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        this.email.next(data.email);
      }
    })
  }

  getUserEmail(): Observable<string>{
    return this.email.asObservable();
  }

  getLogedStatus(): Observable<boolean>{
    return this.logedInStatus.asObservable();
  }
}

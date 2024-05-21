import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('closeLoginButton') closeLoginButton!: ElementRef;
  @ViewChild('closeRegButton') closeRegButton!: ElementRef;

  passwordType = 'Password';
  formvalid: boolean = false;
  loginForm!: FormGroup;
  code!: string;
  showSignUpFields: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname: [''],
      lname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitFrom() {
    if (this.showSignUpFields) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.loginForm.get('fname')?.clearValidators();
    this.loginForm.get('lname')?.clearValidators();
    this.updateAndValidateForm();
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    let credentials = {
      email: email,
      password: password,
    };
    if (
      email.toLowerCase() == 'admin@gmail.com' &&
      password.toLowerCase() == 'password'
    ) {
      this.authService.onLoginUser(true);
      localStorage.setItem('isadmin', 'true');
      localStorage.setItem('userID', '1234');
      this.storeService.getAllProducts('36', 'desc').subscribe((_products) => {
        localStorage.setItem('products', JSON.stringify(_products));
      });
      this.router.navigate(['/admin']);
    } else {
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          this._snackBar.open(response.message, 'Ok', { duration: 3000 });
          localStorage.setItem('email', this.loginForm.get('email')?.value);
          localStorage.setItem('userID', response.user._id);
          localStorage.setItem('username', response.user.firstName);
          // this.loginForm.reset();

          if (this.closeLoginButton) {
            this.closeLoginButton.nativeElement.click();
          }

          this.sendOTP();
          this.loginForm.reset();
        },
        error: (err: any) => {
          if (err?.error.message) {
            this._snackBar.open(err?.error.message, 'Error', {
              duration: 3000,
            });
          } else {
            this._snackBar.open('Incorrect Username or Password', 'Error', {
              duration: 3000,
            });
          }
        },
      });
    }
  }

  register() {
    this.loginForm.get('fname')?.setValidators(Validators.required);
    this.loginForm.get('lname')?.setValidators(Validators.required);
    this.updateAndValidateForm();
    let register = {
      lastName: this.loginForm.get('fname')?.value,
      firstName: this.loginForm.get('lname')?.value,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authService.signUp(register).subscribe({
      next: (response: any) => {
        if (response?.code == 11000) {
          this._snackBar.open('Your email already registered', 'Ok', {
            duration: 3000,
          });
        } else if (!response?.errors) {
          this._snackBar.open(
            'Your enrollment is successful, Please login !!',
            'Ok',
            { duration: 3000 }
          );
          localStorage.setItem('email', this.loginForm.get('email')?.value);
          localStorage.setItem('userID', response.user._id);
          //this.authService.onLoginUser(true);
          this.loginForm.get('fname')?.clearValidators();
          this.loginForm.get('lname')?.clearValidators();
          this.updateAndValidateForm();
          if (this.closeRegButton) {
            this.closeRegButton.nativeElement.click();
          }

          this.loginForm.reset();
        } else {
          this._snackBar.open(response?._message, 'Ok', { duration: 3000 });
        }
      },
      error: (err: any) => {
        if (err) {
          this._snackBar.open('Unable to connect Database', 'Error', {
            duration: 3000,
          });
        }
      },
    });
  }

  sendOTP() {
    // Call your OTP service to send OTP to the user's email
    this.authService.sendOTP(this.loginForm.get('email')?.value).subscribe({
      next: (response: any) => {
        //window.location.reload();
        this._snackBar.open('OTP sent to your email', 'Ok', { duration: 3000 });
      },
      error: (err: any) => {
        this._snackBar.open('Failed to send OTP', 'Ok', { duration: 3000 });
      },
    });
    this.router.navigate(['/verification']);
  }

  handleOTPVerification(otp: string) {
    // Handle OTP verification result here
    console.log('OTP entered by user:', otp);
  }

  dummyLogin(dummyAuthSuccess: boolean) {
    // Dummy login for test
    this.authService.onLoginUser(dummyAuthSuccess);
    localStorage.setItem('userID', '2345');
    this.storeService.getAllProducts('36', 'desc').subscribe((_products) => {
      localStorage.setItem('products', JSON.stringify(_products));
    });
    this.router.navigate(['/home']);
  }

  toggleSignUp() {
    this.showSignUpFields = !this.showSignUpFields;
  }

  updateAndValidateForm() {
    this.loginForm.get('fname')?.updateValueAndValidity();
    this.loginForm.get('lname')?.updateValueAndValidity();
  }
}

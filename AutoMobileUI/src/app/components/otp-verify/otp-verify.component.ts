import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css'],
})
export class OtpVerifyComponent implements OnInit {
  enteredOTP: string = '';
  code!: string;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private storeService: StoreService
  ) {}

  ngOnInit() {}
  verifyOTP() {
    console.log('here verify otp');
    const email = localStorage.getItem('email');
    this.authService.verifyOTP(email, this.code).subscribe({
      next: (response: any) => {
        this._snackBar.open('OTP verified successfully', 'Ok', {
          duration: 3000,
        });
        this.authService.onLoginUser(true);
        this.loadProducts();
        // Proceed with login after OTP verification
        this.router.navigate(['/home']);
        this.router.navigate(['/admin']); // remove later
      },
      error: (err: any) => {
        this._snackBar.open('Failed to verify OTP', 'Error', {
          duration: 3000,
        });
      },
    });
  }

  loadProducts() {
    this.storeService
      .getAllProducts('36', 'desc')
      .subscribe((_products) => {
        localStorage.setItem('products', JSON.stringify(_products));
      });
  }
}

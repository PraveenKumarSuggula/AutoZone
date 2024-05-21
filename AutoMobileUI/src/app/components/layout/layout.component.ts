import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  userLoggedIn = false;
  onMenuShow = false;
  constructor(private cartService: CartService, private router: Router, private authService: AuthenticationService) {
    this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.onMenuShow = event.urlAfterRedirects.includes("/verification") || event.urlAfterRedirects.includes("/login") || event.urlAfterRedirects.includes("/signup") ? false: true;
    });
    this.authService.userLoggedIn.subscribe((x: boolean) => this.userLoggedIn = x);
  }

  cart: Cart = { items: [] };
  ngOnInit(): void {
    this.start();
  }

  start() {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
}

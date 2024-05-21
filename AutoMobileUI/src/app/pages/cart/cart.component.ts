import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

declare var paypal: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  cart: Cart = { items: [
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id: 1
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 120,
    quantity: 5,
    id: 2
  },
]};

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ]
  constructor(private cartService: CartService, private _snackBar: MatSnackBar, private router: Router) { }

  @ViewChild('paypalPopup') paypalPopup!: ElementRef;
  paypalRendered: boolean = false;
  paypalButtonContainer: any;
  paymentSuccess: boolean = false;

  ngOnInit(): void {
    this.start();
  }

  start(){
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number{
    return this.cartService.getTotal(items);
  }

  onClearCart(): void{
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void{
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void{
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void{
    this.cartService.removeQuantity(item);
  }

  buyNow(): void {
    this.closePaypalPopup();
    this.renderCreditCardPayment();
  }

  closePaypalPopup() {
    // Close the PayPal popup
    this.paypalPopup.nativeElement.style.display = 'none';
  }

  renderCreditCardPayment(): void {
    this.paypalPopup.nativeElement.style.display = 'block';
    this.paypalButtonContainer = document.getElementById(
      'paypal-button-container'
    );
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.getTotal(this.cart.items).toFixed(2),
                  currency_code: 'USD',
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          console.log('Payment successful:', order);
          this._snackBar.open('Payment successful.', 'Ok', { duration: 10000 });
          this._snackBar.open('Order Placed Successfully. Happy to serve you :)', 'Ok', { duration: 20000 });
          this.purchaseItems();
          this.closePaypalPopup();
        },
        onError: (err: any) => {
          //console.error('An error occurred during payment:', err);
          this._snackBar.open('An error occurred during payment:', 'Ok', { duration: 10000 });
        },
      })
      .render(this.paypalButtonContainer);
  }

  purchaseItems() {
    this.router.navigate(['/home']);
  }
}

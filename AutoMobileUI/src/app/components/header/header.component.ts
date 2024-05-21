import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductAddDialogComponent } from 'src/app/pages/home/components/product-add-dialog/product-add-dialog.component';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  private _cart: Cart = { items: []};
  itemsQuantity = 0;
  selectedLanguage: string = 'en';

  isMenuToggled = true;
  loginHeader: boolean = false;
  userLoggedIn = false;
  @Output() logoutUser = new EventEmitter<any>();
  @Output() addProduct = new EventEmitter<any>();
  userName: string = '';
  isAdmin: boolean = false; 
  
  @Input()
  get cart(): Cart{
    return this._cart;
  }
  set cart(cart: Cart){
    this._cart = cart;

    this.itemsQuantity = cart.items
    .map((item)=> item.quantity)
    .reduce((prev, current) => prev + current, 0);
  }

  constructor(private cartService: CartService, private router: Router, private storeService: StoreService, public dialog: MatDialog) { 
    this.userName = localStorage.getItem('username') || 'Manikanta';
    var admin = localStorage.getItem('isadmin');
    debugger
    this.isAdmin = admin == 'true' ? true: false;
  }

  onLanguageSelected(event: any) {
    this.selectedLanguage = event?.value;
    this.storeService.setSelectedLanguage(this.selectedLanguage);
    
  }

  getTotal(items: Array<CartItem>): number{
    return this.cartService.getTotal(items);
  }

  onClearCart(){
    this.cartService.clearCart();
  }

  logout(){
    this.logoutUser.emit(false);
    this.router.navigate(['/login']);
    localStorage.removeItem("userID");
    localStorage.removeItem("isadmin");
  }

  feedback(){
    this.router.navigate(['/feedback']);
  }

  home(){
    this.router.navigate(['/home']);
  }

  addProducts(){
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: '400px',
      data: { }, // Pass a copy of the product data to the dialog
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result !== undefined) {
        let products = JSON.parse(localStorage.getItem('products') || 'null') as Product[];
        products.push(result);
        //localStorage.setItem('products', JSON.stringify(products));
        this.storeService.addProducts(products);
        //this.addProduct.emit();
      }
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { CartService } from './../../services/cart.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  category: string | undefined;
  cols: number = 4;
  rowHeight = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  count: string = '12';
  productSubscription: Subscription | undefined;
  productsToShow: any;

  constructor(private cartService: CartService, private storeService: StoreService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.storeService.products$.subscribe(products => {
      debugger
      this.products = products;
      const localStorageProducts = JSON.parse(localStorage.getItem('products') || 'null') as Product[] | undefined;

      if (!this.products.length || JSON.stringify(this.products) === JSON.stringify(localStorageProducts)) {
        this.products = localStorageProducts;
      }
      this.productsToShow = this.products?.sort((a, b) => b.id - a.id).slice(0, parseInt(this.count));
    });
  }

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    if(this.category === 'All Products'){
      this.productsToShow = this.products;
    }
    else {
      this.productsToShow = this.products?.filter((product:any) => product.category == this.category);
    }
    
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsShowCountChange(count: number = 12): void {
    this.storeService.products$.subscribe(products => {
      this.products = products;
      const localStorageProducts = JSON.parse(localStorage.getItem('products') || 'null') as Product[] | undefined;

      if (!this.products.length || JSON.stringify(this.products) === JSON.stringify(localStorageProducts)) {
        this.products = localStorageProducts;
      }
      this.productsToShow = this.products?.sort((a, b) => b.id - a.id).slice(0, count);
    });
  }

  itemsToShowChange(text: string){
    if(text == ''){
      this.productsToShow = this.products;
    }
    else{
      this.productsToShow = this.products?.filter(product => {
        return product.title.toLowerCase().includes(text);
      });
    }
    
  }
}

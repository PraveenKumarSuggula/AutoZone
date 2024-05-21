import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css'],
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() updatedProducts = new EventEmitter<Product>();
  @Output() deletedProducts = new EventEmitter<null>();
  isAdmin: boolean = false;

  constructor(public dialog: MatDialog, private storeService: StoreService) {
    var admin = localStorage.getItem('isadmin');
    this.isAdmin = admin == 'true' ? true: false;
  }

  onEditProduct(): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: { ...this.product }, // Pass a copy of the product data to the dialog
    });

    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result !== undefined) {
        //this.updateProduct.emit(result);
        this.storeService.updateItem(result).subscribe((products) => {
          localStorage.setItem('products', JSON.stringify(products));
          this.updatedProducts.emit(products);
        });
      }
    });
  }

  onAddToCart(): void {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }

  onDeleteProduct(): void {
    let products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    let productsUpdated = products.filter(product => product.id !== this.product?.id);  
    localStorage.setItem('products', JSON.stringify(productsUpdated));
    this.deletedProducts.emit();
  }
  
}

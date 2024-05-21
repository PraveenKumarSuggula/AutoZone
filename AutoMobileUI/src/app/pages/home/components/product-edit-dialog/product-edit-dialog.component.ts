import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.css']
})
export class ProductEditDialogComponent {

  @Output() productUpdated = new EventEmitter<Product>();

  constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}

  ngOnInit(): void {
    console.log('Initial Product Data:', this.data); // Log the initial product data
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveChanges(updatedProduct: Product): void {
    this.productUpdated.emit(updatedProduct);
    this.dialogRef.close(updatedProduct);
  }

}

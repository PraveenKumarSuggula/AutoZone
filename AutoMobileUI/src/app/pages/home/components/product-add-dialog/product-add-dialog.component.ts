import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.css']
})
export class ProductAddDialogComponent implements OnInit {

  @Output() saveChanges: EventEmitter<any> = new EventEmitter<any>();
  data: any = {
    image: '' // Initialize image property
  };
  @ViewChild('imageInput') imageInput: any;

  constructor(
    public addDialogRef: MatDialogRef<ProductAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    // If dialogData has image property, assign it to data.image
    if (dialogData && dialogData.image) {
      this.data.image = dialogData.image;
    }
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.addDialogRef.close();
  }

  onSaveChanges(): void {
    debugger
    this.data.id = 37;
    this.data.price = 37;
    this.data.rating= {
      rate: 4.8,
      count: 400,
    },
    this.saveChanges.emit(this.data);
    this.addDialogRef.close(this.data);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = () => {
      const imageData: string | ArrayBuffer | null = reader.result;
      if (typeof imageData === 'string') {
        // Update data.image with the image path
        this.data.image = imageData;
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}

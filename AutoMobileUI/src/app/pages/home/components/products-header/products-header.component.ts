import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.css']
})
export class ProductsHeaderComponent implements OnInit {

  itemsShowCount = 12;
  itemsToShow = [];
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsShowCountChange = new EventEmitter<number>();
  @Output() itemsToShowChange = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onItemsUpdated(count: number): void{
    this.itemsShowCount = count;
    this.itemsShowCountChange.emit(count);
  }

  onColumnsUpdated(colsNum: number): void{
    this.columnsCountChange.emit(colsNum);
  }

  filterItems(event: any) {
    this.itemsToShowChange.emit(event.target.value.toLowerCase());
  }
}

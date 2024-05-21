import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories = ['All Products', 'Blades','Trailer', 'Battery', 'Brake', 'Brake Pads', 'Suspension', 'Cleaner', 'Air Intakers', 'Filter', 'Oils'];

  @Output() showCategory = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onShowCategory(category: string): void {
    debugger
    this.showCategory.emit(category);
  }
  handleClick(event: Event, categoryitem: string) {
    // Prevent default button action if clicked directly on button
    if (event.target === event.currentTarget) {
      event.preventDefault();
    }
    this.onShowCategory(categoryitem);
  }

}

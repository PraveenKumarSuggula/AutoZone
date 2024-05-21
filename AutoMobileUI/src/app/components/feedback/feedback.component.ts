import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  selectedCategory: string = '';
  feedback: string = '';
  feedbackInvalid: boolean = false;
  dropdownOpen: boolean = false;
  rating = 0;
  products: any;
  submittedFeedbacks: string[] = []; 

  constructor(private router: Router, private storeService: StoreService) {
  }
  ngOnInit(): void {
    this.storeService.getAllProducts('12', 'desc').subscribe((_products) => {
      this.products = _products;
      //localStorage.setItem('products', this.products.toString())
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.toggleDropdown();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  submitFeedback() {
    if (!this.feedback.trim()) {
      this.feedbackInvalid = true;
      return;
    }
    this.submittedFeedbacks.push(this.feedback);
    this.feedback = '';
    this.selectedCategory = '';
    this.feedbackInvalid = false;
    this.rating = 0.1;
  }

}

import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { Coupon } from 'src/app/common/coupon';
import { CartService } from 'src/app/services/cart.service';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit{
clearError() {
  this.error = ''
}
  
  totalQuantity: number = 0
  totalPrice: number = 0.00
  cartItems : CartItem[] = []
  
  couponCode: string = '';
  error: string = '';
  totalPricest: number = 0.00
  
  constructor(private cartService : CartService) {  
  }
  
  ngOnInit(): void {
    this.updateCartDetails()
    
  }
  
  updateCartDetails() { // Dynamically add value for  total
    this.cartService.error$.subscribe((error) => {
      this.error = error })

    this.cartItems = this.cartService.cartItems
    
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data )  
    
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data )
      
    this.cartService.totalPriecest.subscribe(
      data => this.totalPricest = data )
      
  }
      
  incrementQuantity(theCartItem : CartItem) {
    this.cartService.addToCart(theCartItem)
    this.cartService.checkCodeAndComputeAgain(this.couponCode)
  }

  decrementQuantity(theCartItem : CartItem) {
    this.cartService.decrementQuantity(theCartItem)
    this.cartService.checkCodeAndComputeAgain(this.couponCode)
  }
    
  applyCoupon() {             
    this.cartService.applyCode(this.couponCode)
  }
}

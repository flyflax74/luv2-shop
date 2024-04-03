import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false
  userFullName: string = ''
  sstorage : Storage = sessionStorage

  constructor(private oktaAuthService: OktaAuthStateService, 
              private cartService: CartService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth ) {}

  ngOnInit(): void {
      // subcribe to authen state changes
      this.oktaAuthService.authState$.subscribe(
        (result) => {
          this.isAuthenticated = result.isAuthenticated!
          this.getUserDetails()
        }
      )
  }

  getUserDetails() {
    this.oktaAuth.getUser().then(
      (res) => {
        console.log(typeof(res) + `data about res : ${res}` )
        this.userFullName = res.name as string

        // retrieve user's email from authen response and store it
        const theEmail = res.email
        this.sstorage.setItem('userEmail', JSON.stringify(theEmail))
      }
    )
  }

  logout() {
    // terminate session and remove token
    this.oktaAuth.signOut()
    this.cartService.cartItems = []
    this.cartService.totalPrice.next(0.00)
    this.cartService.totalQuantity.next(0)
  }

}

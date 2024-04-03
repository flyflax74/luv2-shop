import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';


import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';

import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { HMFormService } from 'src/app/services/hmform.service';

import { HMValidators } from 'src/app/validators/hmvalidators';

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('myInput') myInput!: ElementRef;
  checkoutFormGroup!: FormGroup

  totalPrice: number = 0.00
  totalQuantity: number = 0

  creditCardMonths: number[] = []
  creditCardYears: number[] = []

  countries: Country[] = []
  shippingAddressStates: State[] = []
  billingAddressStates: State[] = []

  isReadOnly = false
  isDisableButton : boolean = false

  sstorage: Storage = sessionStorage

  // initialize Stripe Api
  stripe = Stripe(environment.stripePublicKey)
  
  paymentInfo: PaymentInfo = new PaymentInfo()
  cardElement: any
  displayErrorElement: any = ""

  constructor(private formBuilder: FormBuilder,
    private hmFormService: HMFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // populate Month & Year Data || later dont need anymmore
    const startMonth: number = new Date().getMonth() + 1                      // +1 because JS Date Object Month are zero-based
    this.hmFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
    )
    this.hmFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data
      }
    )

    // populate Country Data
    this.hmFormService.getCountries().subscribe(
      data => this.countries = data
    )

    const theEmail = JSON.parse(this.sstorage.getItem('userEmail')!)

    // Form Group :   // one fail,  error all form grouop.
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ),
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required])
      }),

      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2)]),
        // cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        // securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        // expirationMonth: '',
        // expirationYear: ''
      })

    })

    // Setup Stripe Payment Form
    this.setupStripePaymentForm()
    this.yourOrder()
  }

  // Getter
  get firstName() { return this.checkoutFormGroup.get('customer.firstName') }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName') }
  get email() { return this.checkoutFormGroup.get('customer.email') }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
  get shippingAddresszipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode') }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') }
  get billingAddresszipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode') }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType') }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') }


  // populate State Data
  getState(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName)
    const countryCode = formGroup?.value.country.code
    const countryName = formGroup?.value.country.name                 // Use for check

    this.hmFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data
        }
        else {
          this.billingAddressStates = data
        }
        // select first item by default 
        formGroup?.get('state')?.setValue(data[0])               // formGroup!.value.state =  data[0]           doesn't work

      }
    )
  }

  copyShippingAddressToBilling(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
      this.billingAddressStates = this.shippingAddressStates
      this.isReadOnly = true
      console.log(this.checkoutFormGroup.controls['shippingAddress'].value)
    }
    else {                                              // reset data:  this.checkoutFormGroup.controls['billingAddress'].reset()
      //this.billingAddressStates = []
      this.isReadOnly = false
    }
  }
  exactlyCopy() {                                      // 2 function chạy cùng lúc nên cần SetTimeOut
    if (this.myInput.nativeElement.checked) {
      const _this = this
      setTimeout(function () {
        console.log(_this.checkoutFormGroup.controls['shippingAddress'].value)
        _this.checkoutFormGroup.controls['billingAddress']
          .setValue(_this.checkoutFormGroup.controls['shippingAddress'].value)
        _this.billingAddressStates = _this.shippingAddressStates
      }, 50)
    }
  }

  handleMonthsAndYears() {
    const currentYear: number = new Date().getFullYear()
    const selectedYear: number = Number(this.checkoutFormGroup.get('creditCard')?.value.expirationYear)         // return null if not exist, nên dùng
    const selectedYear2: number = Number(this.checkoutFormGroup.controls['creditCard'].value.expirationYear)    // throw error if not exist

    let startMonth: number

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1
    }
    else {
      startMonth = 1
    }

    this.hmFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    )
  }

  yourOrder() {
    this.cartService.totalPriecest.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data  )
  }

  // @@ what kind of syntax with d.ts file
  setupStripePaymentForm() {
    
    // Do they wait for stripe html ? 
    var elements = this.stripe.elements()
    this.cardElement = elements.create('card', {hidePostalCode: true})
    this.cardElement.mount('#card-element')

    // Add event binding
    this.cardElement.on('change', (event:any) => {
      this.displayErrorElement = document.querySelector('#card-errors')
      if(event.complete) {
        this.displayErrorElement.textContent = ''
      }
      else if (event.error) {
        this.displayErrorElement.textContent = event.error.message
      }
    } )
  }

  onSubmit() {
    // disable payment button
    this.isDisableButton = true

    // set up order
    let order = new Order
    order.totalPrice = this.totalPrice
    order.totalQuantity = this.totalQuantity

    // create orderItems
    const cartItems = this.cartService.cartItems                                                  // get
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    // setup purchase and populate data to purchase 
    let purchase = new Purchase()

    purchase.customer = this.checkoutFormGroup.controls['customer'].value

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value
    purchase.billingAddress.state = this.checkoutFormGroup.controls['billingAddress'].value.state.name
    purchase.billingAddress.country = this.checkoutFormGroup.controls['billingAddress'].value.country.name

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value
    purchase.shippingAddress.state = this.checkoutFormGroup.controls['shippingAddress'].value.state.name
    purchase.shippingAddress.country = this.checkoutFormGroup.controls['shippingAddress'].value.country.name

    // populate purchse - order & orderItems
    purchase.order = order
    purchase.orderItems = orderItems

    // compute paymentInfo
    this.paymentInfo.amount = Math.round(this.totalPrice*100)
    this.paymentInfo.currency = 'USD'
    this.paymentInfo.receiptEmail = purchase.customer.email

    if(!this.checkoutFormGroup.invalid && this.displayErrorElement.textContent=='') {
    // call RestAPI
     this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(  
        (paymentInfoResponse) => {
          this.stripe.confirmCardPayment(paymentInfoResponse.client_secret,       // a method of Stripe API sending data directly 
                                         {payment_method: {
                                            card: this.cardElement,
                                            billing_details: {
                                                email:   purchase.customer.email,
                                                name:   `${purchase.customer.lastName} ${purchase.customer.firstName}`,
                                                address: {
                                                    line1:        purchase.billingAddress.street,
                                                    city:         purchase.billingAddress.city,
                                                    state:        purchase.billingAddress.state,
                                                    postal_code:  purchase.billingAddress.zipCode,
                                                    country:      this.billingAddressCountry?.value.code,
                                                }
                                            } 
                                          }},
                                         {handleAction: false})
                     .then((result:any) => {
                      if(result.error) {
                        this.isDisableButton = false
                        alert('There was an error' + result.error.message)
                      } 
                      else {  // call RestApi to place order
                        this.checkoutService.placeOrder(purchase).subscribe(
                          {
                            next: (response:any) => {
                              alert(`Your order has been received. \n Order Tracking Number: ${response.orderTrackingNumber}`)
                              console.log(typeof (response))
                              console.log(response)
                              // reset cart
                              this.resetCart()
                              this.isDisableButton = false
                            },
                            error: (err:any) => {
                              this.isDisableButton = false
                              alert(`There was an error: ${err.message}`)
                            }
                          }
                        )
                      }
                     })
         })
    } 
    else {  this.checkoutFormGroup.markAllAsTouched()
            console.log("still have error, cannot purchase")
            console.log("check so ki tu:" + this.displayErrorElement.textContent)
            return
    }
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = []
    this.cartService.totalPrice.next(0.00)
    this.cartService.totalQuantity.next(0)

    // clear storage also
    this.cartService.persistCartItems()

    // reset the form
    this.checkoutFormGroup.reset()

    // navigate back to the product page
    this.router.navigateByUrl("/products")
  }
}


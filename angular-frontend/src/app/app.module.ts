import { ElementRef, Inject, Injector, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import myAppConfig from './config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent } from '@okta/okta-angular';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';


const oktaConfig = myAppConfig.oidc
const oktaAuth = new OktaAuth(oktaConfig)

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // use injector to access any service available
  const router = injector.get(Router)
  
  router.navigate(['/login'])
}

const routes : Routes = [

  {path: 'login/callback', component : OktaCallbackComponent},      // help store OAuth + OIDC token
  {path: 'login', component : LoginComponent},

  {path: 'members', component : MembersPageComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage}},
  {path: 'order-history', component : OrderHistoryComponent, canActivate: [OktaAuthGuard], data: {onAuthRequired: sendToLoginPage}},


  {path: 'checkout', component : CheckoutComponent},   

  {path: 'products/:id' , component : ProductDetailsComponent},
  
  {path: 'category/:id/:name', component : ProductListComponent},         // create new instance
  {path: 'products', component : ProductListComponent},
  
  {path: 'search/:keyword' , component : ProductListComponent},
  {path: 'category', component : ProductListComponent},
  {path: 'cart-detail', component : CartDetailsComponent},


  {path: '', redirectTo: '/products', pathMatch: 'full'}  ,          //  dont give path will return products  -> default
  {path: '**', redirectTo: '/products', pathMatch: 'full' }       // or match on anything not above will return products
]
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchBarComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),             // config
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,                              // ngModel cũng cần import
    OktaAuthModule
    
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: { oktaAuth}}, 
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
 }

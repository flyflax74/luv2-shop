import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request , next))            // interceptor return Promise, so we need from() to change to Observable
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // only add access token for security end point
    const theEndpoint = environment.backendApiUrl + '/orders'
    const securedEndpoint = [theEndpoint]
    if (securedEndpoint.some(url => request.urlWithParams.includes(url))) {
      console.log('success get acces token')
      // get accessToken
      const accessToken = this.oktaAuth.getAccessToken()

      // clone the request and add header (clone because request is immutable)
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      })
    }
    return await lastValueFrom(next.handle(request))          // next.handle(request) return Observable, use lastValueFrom() to re-convert to Promise
  }
}

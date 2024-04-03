import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coupon } from '../common/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private couponUrl = environment.backendApiUrl + '/coupons'
  
  constructor(private httpClient: HttpClient) {}
  
  /* Refactor Code if needed */
  private handleErrors(error: any, customErrorMessage: string = 'Something went wrong. Please check again.'): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(customErrorMessage));
  }

  getCouponData(couponCode: string): Observable<Coupon>  {
      const searchConditionUrl = `${this.couponUrl}/search/findByCode?couponCode=${couponCode}`
      return this.httpClient.get(searchConditionUrl).pipe(
        map((data: any) => ({
          id: data.id,
          code: data.code,
          active: data.active,
          attribute: data.attribute,
          couponCondition: data.conditions
        } as Coupon)),
        catchError((error: any) => this.handleErrors(error, 'Coupon not found. Please check the code and try again.')))
      }
  
  /* Way 2 but need create Constructor in class */
  getCouponData1(couponCode: string): Observable<Coupon>  {
    const searchConditionUrl = `${this.couponUrl}/search/findByCode?couponCode=${couponCode}`
    return this.httpClient.get(searchConditionUrl).pipe(
      map((data: any) =>  new Coupon(data.id, data.code, data.active, data.couponCondition)))
  }
  
  /* Way 2 but MORE CLEAR */
  getCouponData2(couponCode: string): Observable<Coupon>  {
    const searchConditionUrl = `${this.couponUrl}/search/findByCode?couponCode=${couponCode}`
    return this.httpClient.get(searchConditionUrl).pipe(
      map((data: any) => {
        const { id, code, active, counponCondition } = data; // Destructuring, Can create a name by reversed assignment
        return new Coupon(id, code, active, counponCondition) 
      }))    
  }

}
  
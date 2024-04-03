import { Injectable } from '@angular/core';
import { OrderHistory } from '../common/order-history';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  orderUrl = environment.backendApiUrl + `/orders`

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail : string) : Observable<OrderHistory[]> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl).pipe(
      map(response => response._embedded.orders)
    )
  }

}

interface GetResponseOrderHistory {
  _embedded: {
    orders : OrderHistory[]
  }
}

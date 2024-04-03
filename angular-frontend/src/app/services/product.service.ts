import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.backendApiUrl +'/products'
  private categoryUrl = environment.backendApiUrl +'/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePageNumber: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePageNumber}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const findCategoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
    return this.getProducts(findCategoryUrl)
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    console.log('searchUrl: ' + searchUrl)
    return this.getProducts(searchUrl)
  }

  searchProductPaginate(thePageNumber: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePageNumber}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl)
  }

  // Refacting the code
  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}


interface GetResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    totalElements: number;
    size: number,
    totalPages: number,
    number: number
  }
}
/* Không dùng interface thì (response:data) */
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []
  previousCategoryId: number =1
  currentCategoryId: number = 1
  currentCategoryName: string = 'Books'
  searchMode: boolean = false

  // properties for pagination
  thePageNumber :number = 1
  thePageSize   :number = 5
  theTotalElements:number = 0

  previousKeyword: string = ''


  constructor( private productService: ProductService,
               private cartService : CartService,
               private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.listProducts()
      })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if (this.searchMode) {
      this.handleSearchProducts()
    }
    else {this.handleListProducts() }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!

    // reset page to 1
    if(this.previousKeyword != theKeyword) {
      this.thePageNumber =1
    }
    this.previousKeyword = theKeyword

    // search for the products using keyword
    this.productService.searchProductPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               theKeyword)
                        .subscribe(this.processResult())
  }

  handleListProducts() {
    // check "id" para is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');              // null thì chạy default id = 1;

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;               // take from path in route pass by routeLink      
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }


    // change category start count again
    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId

    // get the products for the given categoryId
    this.productService.getProductListPaginate( this.thePageNumber -1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                       .subscribe(this.processResult())                          // subscribe là sau khi đã có data và tiến hành gán lại
  }

  updatePageSize(pageSize:string) {
    this.thePageSize = +pageSize
    this.thePageNumber = 1
    this.listProducts()
  }

  processResult() {
    return (data:any) => {
      this.products = data._embedded.products
      this.thePageNumber = data.page.number  + 1
      this.thePageSize = data.page.size
      this.theTotalElements = data.page.totalElements
    }
  }

  addToCart(theProduct : Product) {
    const theCartItem = new CartItem(theProduct)

    this.cartService.addToCart(theCartItem)
  }
}

import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, throwError } from 'rxjs';
import { Coupon } from '../common/coupon';
import { CouponService } from './coupon.service';
import { CouponCondition } from '../common/coupon-condition';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = []
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0)          // Cần giá trị current (default)
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0)          
  // If using Subject<> class because it only gives newest data, 
  
  // sstorage : Storage = sessionStorage  -> reference to web browser's session storage
  lstorage : Storage = localStorage
  
  errorSubject = new BehaviorSubject<string>('');
  
  error$ = this.errorSubject.asObservable()
  // get error$(): Observable<string> { return this.errorSubject.asObservable();}   ; More explicit
  
  subTotalPrice: number = 0
  totalPriecest:  BehaviorSubject<number> = new BehaviorSubject<number>(0)
  
 
 

  constructor(private couponService : CouponService) { 
    // read data from storage
    let data = JSON.parse(this.lstorage.getItem('mainKeyCartItems')!)
    if(data) {
      this.cartItems = data
      this.computeCartTotals()
    };
    this.totalPrice.subscribe((data) => {
      this.subTotalPrice = data
      this.totalPriecest.next(data) 
      console.log(this.totalPriecest) // Không hiển thị ở lần đầu tiên (fresh)
    });
    this.totalPriecest.next(this.subTotalPrice)
}

  computeCartTotals() {
    let  totalPriceValue :number = 0
    let  totalQuantityValue :number = 0
    
    totalQuantityValue = this.cartItems.reduce((a,b) => a+b.quantity,0)
    totalPriceValue = this.cartItems.reduce((a,b) => a+b.unitPrice * b.quantity, 0)
    
    // emit data
    this.totalQuantity.next(totalQuantityValue)
    this.totalPrice.next(totalPriceValue)

    // persist data
    this.persistCartItems()
  }
  
  addToCart(theCartItem : CartItem) {
    
    // check item in cart or not and then do add process
    let alreadyExistsInCart: boolean = false
    let existingCartItem: CartItem  = undefined!
    
    if(this.cartItems.length > 0) {
      
      existingCartItem = this.cartItems.find(tempCartItems => tempCartItems.id === theCartItem.id)!       // Khoong tim thay se tra ve undefined
      
      alreadyExistsInCart = !!(existingCartItem)
    }

    if(alreadyExistsInCart) {
        existingCartItem.quantity++
      } else {
        this.cartItems.push(theCartItem)
    }

    this.computeCartTotals()
  }
  
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--

    if (theCartItem.quantity < 1) {
      this.remove(theCartItem)
    } 
    else {
      this.computeCartTotals()
    }
    
  }

  remove(theCartItem: CartItem) {
    
    //get index
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)
    
    // sometime not found index return -1
    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1)

      this.computeCartTotals()
    }
    
  }

  persistCartItems() {
    this.lstorage.setItem('mainKeyCartItems', JSON.stringify(this.cartItems))
  }


  // only for reference purpose
  finalTotalsWithCoupon(coupon: Coupon)  {
    if (!coupon.active) {
     throw new Error('Mã giảm giá chưa được kích hoạt. Vui lòng thử lại sau.')   // dùng try catch   
    }

    let discountAmount = 0

    // Danh sách các điều kiện trong coupon.couponCondition
    const conditions = coupon.couponCondition;

    // Viết chung, chưa refactor
    combineLatest([this.totalPrice, of(discountAmount)])
      .pipe(
        map(([totalPriceValue, discount]) => {              // Đã có sẵn giá trị ban đầu
            console.log(totalPriceValue)
          // Kiểm tra điều kiện 'minimum_amounts' và cập nhật maxDiscount nếu điều kiện đúng
          if (coupon.attribute == 'minimum_amounts') {             
            let _maxDiscount = 0;
            conditions.forEach(condition => {
            // Chuyển đổi conditions.value sang kiểu Number
            const conditionValue = parseFloat(condition.value);
            if (!isNaN(conditionValue) && totalPriceValue > conditionValue && condition.discountAmount > _maxDiscount) {
              _maxDiscount = condition.discountAmount;
            }
            })
            // Kiểm tra nếu _maxDiscount vẫn bằng 0,                    ??? check có kết thúc chain không ???
            if (_maxDiscount == 0) {             
             // throwError(() => new Error('Chưa đạt giá trị đơn hàng tối thiểu'))
              throw new Error('Chưa đạt giá trị đơn hàng tối thiểu')
              
            }
            discount = _maxDiscount          
          }

          if (coupon.attribute == 'applicable_date') {
            let _maxDiscount = 0;
            const currentDate = new Date();
  
            conditions.forEach(condition => {
              const valueDate = new Date(condition.value);
  
              if (currentDate < valueDate && condition.discountAmount > _maxDiscount) {
                _maxDiscount = condition.discountAmount;
              }
            });
            // Kiểm tra nếu maxDiscount vẫn bằng 0,                   
            if (_maxDiscount == 0) {             
               // throwError(() => new Error('Voucher đã hết hạn sử dụng'))
                  throw new Error('Voucher đã hết hạn sử dụng')
           }
           discount =  _maxDiscount            
          }
          
          const result = totalPriceValue * (1 - discount / 100);
          console.log(result)
          return result
          
        }),
        catchError(error => {
          // Hiển thị lỗi
          console.error('An error occurred at combineLates:', error.message);
          // Tạo Ob Lỗi để Sub
          return throwError(() => new Error(error.message) )
        })
      )
      .subscribe(
        (result) => this.totalPrice.next(result),
        (error : any) => { this.errorSubject.next(error.message) }
        
      )
      
    }

  applyCode(code: string) {
      this.couponService.getCouponData(code).subscribe(                         // .toPromise().then() instead
      (result : Coupon) => {
        try {
          this.checkCodeAndCompute(result);
          
        } catch (error: any) {
        this.errorSubject.next(error.message);
        
      }},
      (error : any) => this.errorSubject.next(error.message)
    )
  }
  
  cpConditions! : CouponCondition[]   
  cpAttribute!  : string

  checkCodeAndCompute(coupon : Coupon) {
    if (!coupon.active) {
      throw new Error('Mã giảm giá chưa được kích hoạt. Vui lòng thử lại sau.') }
      console.log(this.subTotalPrice)
    let discountAmount = 0
    let subTotalPrice = this.subTotalPrice
    const conditions = coupon.couponCondition;
    
    this.cpConditions = conditions                    // Lấy giá trị ra ngoài
    this.cpAttribute = coupon.attribute               // Lấy giá trị ra ngoài
      
    if (coupon.attribute == 'minimum_amounts') {             
      let _maxDiscount = 0;
      
      conditions.forEach(condition => {
      // Chuyển đổi conditions.value sang kiểu Number
                const conditionValue = parseFloat(condition.value);
      
                if (!isNaN(conditionValue) && subTotalPrice > conditionValue && condition.discountAmount > _maxDiscount) {
                    _maxDiscount = condition.discountAmount;
                }
                })
      // Kiểm tra nếu _maxDiscount vẫn bằng 0,                    ??? check có kết thúc chain không ???
      if (_maxDiscount == 0) {             
       // throwError(() => new Error('Chưa đạt giá trị đơn hàng tối thiểu'))
        throw new Error('Chưa đạt giá trị đơn hàng tối thiểu')        
      }
      discountAmount = _maxDiscount          
    }

    if (coupon.attribute == 'applicable_date') {
      let _maxDiscount = 0;
      const currentDate = new Date();

      conditions.forEach(condition => {
                const valueDate = new Date(condition.value);

                if (currentDate < valueDate && condition.discountAmount > _maxDiscount) {
                  _maxDiscount = condition.discountAmount;
                }
              });
      // Kiểm tra nếu maxDiscount vẫn bằng 0,                   
      if (_maxDiscount == 0) {             
         // throwError(() => new Error('Voucher đã hết hạn sử dụng'))
            throw new Error('Voucher đã hết hạn sử dụng')
     }
     discountAmount =  _maxDiscount            
    }

    let totalPriceValue = subTotalPrice * (1 - discountAmount / 100)
    this.totalPriecest.next(totalPriceValue)
    this.errorSubject.next('')
    }
    
  checkCodeAndComputeAgain(code: string) {
    try { 
      const displayString = code === '' ? 'không có code' : `code là ${code}`;
      console.log(displayString)
      if(code) {
        
        let discountAmount = 0
          
        if (this.cpAttribute == 'minimum_amounts') {             
          let _maxDiscount = 0;
          
          this.cpConditions.forEach(condition => {
          // Chuyển đổi conditions.value sang kiểu Number
                    const conditionValue = parseFloat(condition.value);
          
                    if (!isNaN(conditionValue) && this.subTotalPrice > conditionValue && condition.discountAmount > _maxDiscount) {
                        _maxDiscount = condition.discountAmount;
                    }
                    })
          // Kiểm tra nếu _maxDiscount vẫn bằng 0,                    ??? check có kết thúc chain không ???
          if (_maxDiscount == 0) {             
          // throwError(() => new Error('Chưa đạt giá trị đơn hàng tối thiểu'))
            throw new Error('Chưa đạt giá trị đơn hàng tối thiểu')        
          }
          discountAmount = _maxDiscount          
        }
        let totalPriceValue = this.subTotalPrice * (1 - discountAmount / 100)
        this.totalPriecest.next(totalPriceValue)
        this.errorSubject.next('')
      }

    } catch (error : any) {
      this.errorSubject.next(error.message);
    }
  }
  
}


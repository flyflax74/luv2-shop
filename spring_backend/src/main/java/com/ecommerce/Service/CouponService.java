package com.ecommerce.Service;

public interface CouponService {
    double calculateCouponValue(String couponCode, double totalAmount);
}

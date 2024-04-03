package com.ecommerce.Service;

import com.ecommerce.Dto.PaymentInfo;
import com.ecommerce.Dto.Purchase;
import com.ecommerce.Dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}

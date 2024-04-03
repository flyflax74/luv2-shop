package com.ecommerce.Controller;

import com.ecommerce.Dto.PaymentInfo;
import com.ecommerce.Dto.Purchase;
import com.ecommerce.Dto.PurchaseResponse;
import com.ecommerce.Service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
    private Logger logger = Logger.getLogger(getClass().getName());
    @Autowired
    private CheckoutService checkoutService;

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        return checkoutService.placeOrder(purchase);
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {
        logger.info("payment amount: " + paymentInfo.getAmount());
        logger.info("Owner Email:" + paymentInfo.getReceiptEmail());
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        String paymentIntentString = paymentIntent.toJson();
        return new ResponseEntity<>(paymentIntentString, HttpStatus.OK);
    }
}

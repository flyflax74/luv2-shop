package com.ecommerce.Service;

import com.ecommerce.Dto.PaymentInfo;
import com.ecommerce.Dto.Purchase;
import com.ecommerce.Dto.PurchaseResponse;
import com.ecommerce.Entity.Customer;
import com.ecommerce.Entity.Order;
import com.ecommerce.Entity.OrderItem;
import com.ecommerce.Repository.CustomerRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    // need to initialize apiKey from constructor
    public CheckoutServiceImpl(@Value("${stripe.key.secret}") String secretKey) {
        Stripe.apiKey = secretKey;
    }
    @Autowired
    private CustomerRepository customerRepository;
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from DTO
        Order order = purchase.getOrder();

        // Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(orderItem -> order.add(orderItem));

        // populate order with 2 address
        order.setBillingAddress(purchase.getBilingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // check if this is an existing customer by unique email and populate
        Customer customer = purchase.getCustomer();
        String email = customer.getEmail();
        Customer customerFromDb = customerRepository.findByEmail(email);
        if(customerFromDb != null) {
            customer = customerFromDb;
        }
        // populate customer with oder
        customer.add(order);

        // save to db -> use Repo
        customerRepository.save(customer);

        // return response

        return new PurchaseResponse(orderTrackingNumber);

    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "H&M Shopping");
        params.put("receipt_email", paymentInfo.getReceiptEmail());     // Default is Admin Email, can;t change

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        // generate UUID : Universally Unique ID
        return UUID.randomUUID().toString();
    }
}

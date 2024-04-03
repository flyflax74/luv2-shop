package com.ecommerce.Dto;

import com.ecommerce.Entity.Address;
import com.ecommerce.Entity.Customer;
import com.ecommerce.Entity.Order;
import com.ecommerce.Entity.OrderItem;
import lombok.Data;

import java.util.Set;
@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address bilingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}

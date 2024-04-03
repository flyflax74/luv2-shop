package com.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;


@Table(name = "product")
@Getter @Setter
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private long id;
    @ManyToOne
    @JoinColumn(name="category_id", nullable = false)
    private ProductCategory category;
    @Column(name ="sku")
    private String sku;
    @Column(name ="name")
    private String name;
    @Column(name ="description")
    private String description;
    @Column(name ="unit_price")
    private BigDecimal unitPrice;
    @Column(name ="image_url")
    private String imageUrl;
    @Column(name ="active")
    private boolean active;
    @Column(name ="units_in_stock")
    private  int unitsInStock;
    @Column(name ="date_created")
    @CreationTimestamp
    private Date dateCreated;
    @UpdateTimestamp
    @Column(name ="last_updated")
    private Date lastUpdated;
}

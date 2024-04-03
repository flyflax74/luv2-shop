package com.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter  @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "coupon")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "attribute", nullable = false)
    private String attribute;

    @OneToMany(mappedBy = "coupon")
    private Set<CouponCondition> conditions;

}

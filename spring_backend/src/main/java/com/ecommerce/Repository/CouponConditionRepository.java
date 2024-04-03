package com.ecommerce.Repository;

import com.ecommerce.Entity.CouponCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Set;
public interface CouponConditionRepository extends JpaRepository<CouponCondition, Long> {
    Set<CouponCondition> findCouponConditionByCouponId(long couponId);
    Set<CouponCondition> findCouponConditionByCouponCode(String code);
}

package com.ecommerce.Repository.RestResourceRepository;

import com.ecommerce.Entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;
@RepositoryRestResource
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String couponCode);     // RepoRestWillRunItToFindAllDataWithManyToOne
}

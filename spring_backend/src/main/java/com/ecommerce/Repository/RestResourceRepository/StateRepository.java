package com.ecommerce.Repository.RestResourceRepository;

import com.ecommerce.Entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;


@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {
    // retrieve http://localhost:4200/api/states/search/findByCountryCode?code=
    List<State> findByCountryCode(@Param("code") String code);
}

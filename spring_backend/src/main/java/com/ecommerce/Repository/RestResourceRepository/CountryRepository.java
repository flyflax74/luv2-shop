package com.ecommerce.Repository.RestResourceRepository;

import com.ecommerce.Entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")        // tên in embbeded
public interface CountryRepository extends JpaRepository<Country, Integer> {
}

package com.ecommerce.Config;

import com.ecommerce.Entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    @Value("${allowed.origins}")
    private String[] theAllowOrigins;
    @Autowired
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
        HttpMethod[] theUnsupportedActions =  {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PATCH};

        disableMethods(Product.class, config, theUnsupportedActions);
        disableMethods(ProductCategory.class ,config, theUnsupportedActions);
        disableMethods(Country.class ,config, theUnsupportedActions);
        disableMethods(State.class ,config, theUnsupportedActions);
        disableMethods(Order.class ,config, theUnsupportedActions);

        // Expose only for 1 entity:    config.exposeIdsFor(ProductCategory.class);

        // Short way expose
        //   Class[] classes = entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new);
        //   config.exposeIdsFor(classes);

        // Expose Ids for all entities
        Set<EntityType<?>> entityTypes = entityManager.getMetamodel().getEntities();
        List<Class> entityClasses = new ArrayList<>();
        for (EntityType i : entityTypes) {
            entityClasses.add(i.getJavaType());
        }
        Class[] domainTypes = entityClasses.toArray(new Class[]{});
        config.exposeIdsFor(domainTypes);

        // Configure cors mapping
        cors.addMapping(config.getBasePath() +  "/**").allowedOrigins(theAllowOrigins);    // method to get base-path from app.properties
    }

    private static void disableMethods(Class theclass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theclass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}

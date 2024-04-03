package com.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;

@Entity @Setter @Getter

@Table(name = "country")
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private int id;

    @Column(name ="code")
    private String code;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy = "country")                    // One is class, many is attribute, map by itself
    @JsonIgnore
    private List<State> states;

}

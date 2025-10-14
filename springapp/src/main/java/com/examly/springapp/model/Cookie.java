package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Cookie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cookieName;
    private String flavor;
    private int price;
    private int quantityAvailable;

    public Cookie() {}

    public Cookie(String cookieName, String flavor, int price, int quantityAvailable) {
        this.cookieName = cookieName;
        this.flavor = flavor;
        this.price = price;
        this.quantityAvailable = quantityAvailable;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCookieName() { return cookieName; }
    public void setCookieName(String cookieName) { this.cookieName = cookieName; }
    public String getFlavor() { return flavor; }
    public void setFlavor(String flavor) { this.flavor = flavor; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
    public int getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(int quantityAvailable) { this.quantityAvailable = quantityAvailable; }
}
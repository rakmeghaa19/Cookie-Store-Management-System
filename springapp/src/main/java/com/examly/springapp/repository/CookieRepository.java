package com.examly.springapp.repository;

import com.examly.springapp.model.Cookie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CookieRepository extends JpaRepository<Cookie, Long> {
    List<Cookie> findByFlavor(String flavor);
    List<Cookie> findAllByOrderByPriceAsc();
    List<Cookie> findByCookieNameContainingIgnoreCase(String cookieName);
    List<Cookie> findByPriceLessThanEqual(int maxPrice);
    List<Cookie> findByQuantityAvailableGreaterThan(int minQuantity);
}
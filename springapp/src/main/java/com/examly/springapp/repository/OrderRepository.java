package com.examly.springapp.repository;

import com.examly.springapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);
    List<Order> findByStatusIgnoreCase(String status);
    List<Order> findByCookieNameContainingIgnoreCase(String cookieName);
}
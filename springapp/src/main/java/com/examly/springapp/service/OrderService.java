package com.examly.springapp.service;

import com.examly.springapp.model.Cookie;
import com.examly.springapp.model.Order;
import com.examly.springapp.repository.CookieRepository;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CookieRepository cookieRepository;

    @Transactional
    public Order createOrder(Order order) {
        // Validate cookie availability
        Cookie cookie = cookieRepository.findByCookieNameContainingIgnoreCase(order.getCookieName())
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Cookie not found: " + order.getCookieName()));
        
        if (cookie.getQuantityAvailable() < order.getQuantity()) {
            throw new RuntimeException("Insufficient quantity available. Available: " + cookie.getQuantityAvailable());
        }
        
        // Calculate total price
        order.setTotalPrice(cookie.getPrice() * order.getQuantity());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        
        // Update cookie quantity
        cookie.setQuantityAvailable(cookie.getQuantityAvailable() - order.getQuantity());
        cookieRepository.save(cookie);
        
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getOrdersByCustomer(String customerName) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusIgnoreCase(status);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order existingOrder = getOrderById(id);
        
        existingOrder.setCustomerName(orderDetails.getCustomerName());
        existingOrder.setCookieName(orderDetails.getCookieName());
        existingOrder.setQuantity(orderDetails.getQuantity());
        existingOrder.setTotalPrice(orderDetails.getTotalPrice());
        existingOrder.setStatus(orderDetails.getStatus());
        
        return orderRepository.save(existingOrder);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        
        // If order is cancelled, restore cookie quantity
        if ("PENDING".equals(order.getStatus()) || "PROCESSING".equals(order.getStatus())) {
            List<Cookie> cookies = cookieRepository.findByCookieNameContainingIgnoreCase(order.getCookieName());
            if (!cookies.isEmpty()) {
                Cookie cookie = cookies.get(0);
                cookie.setQuantityAvailable(cookie.getQuantityAvailable() + order.getQuantity());
                cookieRepository.save(cookie);
            }
        }
        
        orderRepository.deleteById(id);
    }
}
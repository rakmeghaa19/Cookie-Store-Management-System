package com.examly.springapp.service;

import com.examly.springapp.model.Order;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByCustomer(String customerName) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusIgnoreCase(status);
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = getOrderById(id);
        order.setCustomerName(orderDetails.getCustomerName());
        order.setCookieName(orderDetails.getCookieName());
        order.setQuantity(orderDetails.getQuantity());
        order.setTotalPrice(orderDetails.getTotalPrice());
        order.setStatus(orderDetails.getStatus());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(id);
    }
}
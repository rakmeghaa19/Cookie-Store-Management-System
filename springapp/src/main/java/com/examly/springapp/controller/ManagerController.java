package com.examly.springapp.controller;

import com.examly.springapp.model.Cookie;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Order;
import com.examly.springapp.repository.CookieRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins="https://8081-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io")
public class ManagerController {

    @Autowired
    private CookieRepository cookieRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/products")
    public List<Cookie> viewProducts() {
        return cookieRepository.findAll();
    }

    @PostMapping("/products")
    public ResponseEntity<Cookie> createProduct(@RequestBody Cookie cookie) {
        return ResponseEntity.ok(cookieRepository.save(cookie));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Cookie> updateProduct(@PathVariable Long id, @RequestBody Cookie cookie) {
        cookie.setId(id);
        return ResponseEntity.ok(cookieRepository.save(cookie));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        cookieRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody StaffRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username exists"));
        }
        
        User staff = new User();
        staff.setUsername(request.getUsername());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        
        userRepository.save(staff);
        return ResponseEntity.ok(Map.of("message", "Staff created"));
    }

    @GetMapping("/staff")
    public List<User> viewStaff() {
        return userRepository.findAll();
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Staff deleted"));
    }

    @PostMapping("/orders")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/orders")
    public List<Order> viewOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/orders/{id}/process")
    public ResponseEntity<?> processOrder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        order.setStatus(request.get("status"));
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Order processed"));
    }

    public static class StaffRequest {
        private String username;
        private String password;
        private String role;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
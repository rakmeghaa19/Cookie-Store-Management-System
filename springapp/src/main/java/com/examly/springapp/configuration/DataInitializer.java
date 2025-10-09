package com.examly.springapp.configuration;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Cookie;
import com.examly.springapp.model.Order;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.CookieRepository;
import com.examly.springapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CookieRepository cookieRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeCookies();
        initializeOrders();
    }
    
    private void initializeUsers() {
        if (userRepository.count() > 0) return;
        
        userRepository.save(new User("admin", passwordEncoder.encode("admin123"), User.Role.ADMIN));
        userRepository.save(new User("manager", passwordEncoder.encode("manager123"), User.Role.MANAGER));
        userRepository.save(new User("baker1", passwordEncoder.encode("baker123"), User.Role.BAKER));
        userRepository.save(new User("baker2", passwordEncoder.encode("baker123"), User.Role.BAKER));
        userRepository.save(new User("john_doe", passwordEncoder.encode("user123"), User.Role.USER));
        userRepository.save(new User("jane_smith", passwordEncoder.encode("user123"), User.Role.USER));
        userRepository.save(new User("mike_wilson", passwordEncoder.encode("user123"), User.Role.USER));
        
        System.out.println("✓ Users initialized with roles: ADMIN, MANAGER, BAKER, USER");
    }
    
    private void initializeCookies() {
        if (cookieRepository.count() > 0) return;
        
        // Premium Collection
        cookieRepository.save(new Cookie("Classic Chocolate Chip", "Chocolate", 25, 150));
        cookieRepository.save(new Cookie("Double Chocolate Fudge", "Chocolate", 35, 80));
        cookieRepository.save(new Cookie("White Chocolate Macadamia", "White Chocolate", 40, 60));
        cookieRepository.save(new Cookie("Triple Chocolate Brownie", "Chocolate", 42, 45));
        
        // Traditional Favorites
        cookieRepository.save(new Cookie("Oatmeal Raisin Classic", "Oatmeal", 22, 120));
        cookieRepository.save(new Cookie("Peanut Butter Crunch", "Peanut Butter", 28, 90));
        cookieRepository.save(new Cookie("Sugar Cookie Delight", "Vanilla", 18, 200));
        cookieRepository.save(new Cookie("Chocolate Chip Classic", "Chocolate", 20, 180));
        
        // Gourmet Specialty
        cookieRepository.save(new Cookie("Snickerdoodle Supreme", "Cinnamon", 26, 75));
        cookieRepository.save(new Cookie("Lemon Zest Burst", "Lemon", 24, 85));
        cookieRepository.save(new Cookie("Coconut Macaroon", "Coconut", 32, 50));
        cookieRepository.save(new Cookie("Gingerbread Spice", "Ginger", 30, 65));
        cookieRepository.save(new Cookie("Salted Caramel Delight", "Caramel", 38, 55));
        
        // Seasonal Specials
        cookieRepository.save(new Cookie("Pumpkin Spice Autumn", "Pumpkin", 29, 40));
        cookieRepository.save(new Cookie("Mint Chocolate Holiday", "Mint", 33, 55));
        cookieRepository.save(new Cookie("Red Velvet Romance", "Cream Cheese", 36, 45));
        cookieRepository.save(new Cookie("Cranberry Orange Festive", "Orange", 31, 60));
        
        // Healthy & Dietary Options
        cookieRepository.save(new Cookie("Almond Butter Protein", "Almond", 34, 70));
        cookieRepository.save(new Cookie("Gluten-Free Chocolate", "Chocolate", 38, 35));
        cookieRepository.save(new Cookie("Vegan Oat Cookie", "Oatmeal", 32, 40));
        cookieRepository.save(new Cookie("Sugar-Free Vanilla", "Vanilla", 30, 25));
        
        // International Flavors
        cookieRepository.save(new Cookie("Matcha Green Tea", "Matcha", 35, 30));
        cookieRepository.save(new Cookie("Tiramisu Italian", "Coffee", 39, 35));
        cookieRepository.save(new Cookie("Churro Cinnamon", "Cinnamon", 33, 50));
        
        // Limited Edition
        cookieRepository.save(new Cookie("Birthday Cake Surprise", "Vanilla", 41, 20));
        cookieRepository.save(new Cookie("Cookies & Cream", "Vanilla", 37, 25));
        cookieRepository.save(new Cookie("Strawberry Cheesecake", "Strawberry", 40, 30));
        
        // Flash Sale Items (reduced prices)
        cookieRepository.save(new Cookie("Flash Sale - Chocolate Delight", "Chocolate", 19, 25));
        cookieRepository.save(new Cookie("Daily Special - Vanilla Dream", "Vanilla", 16, 30));
        
        System.out.println("✓ 27 diverse cookie varieties initialized across multiple categories");
    }
    
    private void initializeOrders() {
        if (orderRepository.count() > 0) return;
        
        // Recent completed orders
        createOrder("John Doe", "Classic Chocolate Chip", 12, 300, "COMPLETED", LocalDateTime.now().minusDays(1));
        createOrder("Jane Smith", "Double Chocolate Fudge", 6, 210, "COMPLETED", LocalDateTime.now().minusDays(2));
        createOrder("Mike Wilson", "Sugar Cookie Delight", 24, 432, "COMPLETED", LocalDateTime.now().minusDays(3));
        createOrder("Lisa Anderson", "White Chocolate Macadamia", 8, 320, "COMPLETED", LocalDateTime.now().minusDays(4));
        
        // Shipped orders
        createOrder("Tom Rodriguez", "Peanut Butter Crunch", 15, 420, "SHIPPED", LocalDateTime.now().minusDays(1));
        createOrder("Amy Chen", "Snickerdoodle Supreme", 10, 260, "SHIPPED", LocalDateTime.now().minusHours(18));
        
        // Processing orders
        createOrder("Sarah Johnson", "Lemon Zest Burst", 8, 192, "PROCESSING", LocalDateTime.now().minusHours(6));
        createOrder("David Brown", "Coconut Macaroon", 12, 384, "PROCESSING", LocalDateTime.now().minusHours(4));
        createOrder("Maria Garcia", "Gingerbread Spice", 6, 180, "PROCESSING", LocalDateTime.now().minusHours(3));
        
        // Confirmed orders
        createOrder("Robert Miller", "Mint Chocolate Holiday", 20, 660, "CONFIRMED", LocalDateTime.now().minusHours(2));
        createOrder("Jennifer Lee", "Red Velvet Romance", 9, 324, "CONFIRMED", LocalDateTime.now().minusHours(1));
        
        // Pending orders
        createOrder("Emily Davis", "Salted Caramel Delight", 15, 570, "PENDING", LocalDateTime.now().minusMinutes(45));
        createOrder("Chris Taylor", "Almond Butter Protein", 7, 238, "PENDING", LocalDateTime.now().minusMinutes(30));
        createOrder("Jessica Wong", "Matcha Green Tea", 5, 175, "PENDING", LocalDateTime.now().minusMinutes(15));
        
        // Corporate and bulk orders
        createOrder("ABC Corporation - Office Party", "Chocolate Chip Classic", 50, 1000, "COMPLETED", LocalDateTime.now().minusDays(5));
        createOrder("Wilson Family - Birthday Party", "Birthday Cake Surprise", 30, 1230, "COMPLETED", LocalDateTime.now().minusDays(2));
        createOrder("Downtown Cafe - Wholesale", "Oatmeal Raisin Classic", 100, 2200, "SHIPPED", LocalDateTime.now().minusDays(1));
        createOrder("School Fundraiser - PTA", "Sugar Cookie Delight", 75, 1350, "PROCESSING", LocalDateTime.now().minusHours(12));
        
        // International customers
        createOrder("Pierre Dubois", "Tiramisu Italian", 4, 156, "COMPLETED", LocalDateTime.now().minusDays(6));
        createOrder("Yuki Tanaka", "Matcha Green Tea", 8, 280, "SHIPPED", LocalDateTime.now().minusDays(2));
        createOrder("Carlos Mendez", "Churro Cinnamon", 12, 396, "PROCESSING", LocalDateTime.now().minusHours(8));
        
        // Health-conscious customers
        createOrder("Fitness First Gym", "Vegan Oat Cookie", 25, 800, "CONFIRMED", LocalDateTime.now().minusHours(5));
        createOrder("Healthy Living Store", "Sugar-Free Vanilla", 20, 600, "PENDING", LocalDateTime.now().minusHours(1));
        
        System.out.println("✓ 23 diverse sample orders created with realistic scenarios");
    }
    
    private void createOrder(String customerName, String cookieName, int quantity, int totalPrice, String status, LocalDateTime orderDate) {
        Order order = new Order();
        order.setCustomerName(customerName);
        order.setCookieName(cookieName);
        order.setQuantity(quantity);
        order.setTotalPrice(totalPrice);
        order.setStatus(status);
        order.setOrderDate(orderDate);
        orderRepository.save(order);
    }
}
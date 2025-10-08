package com.examly.springapp.configuration;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Cookie;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.CookieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CookieRepository cookieRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Delete and recreate users to ensure fresh credentials
        userRepository.deleteAll();
        
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        System.out.println("Admin user created: admin/admin123");
        
        // Create regular user
        User user = new User();
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole(User.Role.USER);
        userRepository.save(user);
        System.out.println("User created: user/user123");
        
        // Create baker user
        User baker = new User();
        baker.setUsername("baker");
        baker.setPassword(passwordEncoder.encode("baker123"));
        baker.setRole(User.Role.BAKER);
        userRepository.save(baker);
        System.out.println("Baker created: baker/baker123");
        
        // Create manager user
        User manager = new User();
        manager.setUsername("manager");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setRole(User.Role.MANAGER);
        userRepository.save(manager);
        System.out.println("Manager created: manager/manager123");
        
        // Create sample cookies if none exist
        if (cookieRepository.count() == 0) {
            cookieRepository.save(new Cookie("Chocolate Chip", "Chocolate", 25, 100));
            cookieRepository.save(new Cookie("Oatmeal Raisin", "Oatmeal", 20, 80));
            cookieRepository.save(new Cookie("Sugar Cookie", "Vanilla", 15, 120));
            cookieRepository.save(new Cookie("Peanut Butter", "Peanut", 30, 60));
            cookieRepository.save(new Cookie("Double Chocolate", "Chocolate", 35, 40));
            System.out.println("Sample cookies created");
        }
    }
}
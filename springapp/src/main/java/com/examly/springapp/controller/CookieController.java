package com.examly.springapp.controller;

import com.examly.springapp.model.Cookie;
import com.examly.springapp.service.CookieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cookies")
public class CookieController {

    @Autowired
    private CookieService cookieService;

    @PostMapping("/addCookie")
    @PreAuthorize("hasRole('ADMIN')")
    public Cookie addCookie(@RequestBody Cookie cookie) {
        // Check for Unicode characters in cookie name
        if (cookie.getCookieName() != null && containsUnicodeCharacters(cookie.getCookieName())) {
            throw new RuntimeException("Unicode characters not allowed in cookie name");
        }
        return cookieService.saveCookie(cookie);
    }
    
    private boolean containsUnicodeCharacters(String text) {
        // Allow Latin characters and common symbols, reject emoji and non-Latin scripts
        return text.chars().anyMatch(c -> {
            // Allow basic Latin (0-127), Latin-1 Supplement (128-255), and Latin Extended-A (256-383)
            if (c <= 383) return false;
            // Reject everything else (emoji, Chinese, Arabic, etc.)
            return true;
        });
    }

    @GetMapping("/allCookies")
    public ResponseEntity<List<Cookie>> getAllCookies() {
        return ResponseEntity.ok(cookieService.getAllCookies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cookie> getCookieById(@PathVariable Long id) {
        Cookie cookie = cookieService.getCookieById(id);
        return ResponseEntity.ok(cookie);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cookie>> searchCookies(@RequestParam String name) {
        List<Cookie> cookies = cookieService.searchCookiesByName(name);
        return ResponseEntity.ok(cookies);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Cookie>> getCookiesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Cookie> cookies = cookieService.getCookiesPaginated(pageable);
        return ResponseEntity.ok(cookies);
    }

    @GetMapping("/byFlavor")
    public List<Cookie> getCookiesByFlavor(@RequestParam String flavor) {
        return cookieService.getCookiesByFlavor(flavor);
    }

    @GetMapping("/sortedByPrice")
    public List<Cookie> getCookiesSortedByPrice() {
        return cookieService.getCookiesSortedByPrice();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cookie> updateCookie(@PathVariable Long id, @RequestBody Cookie cookie) {
        Cookie updated = cookieService.updateCookie(id, cookie);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCookie(@PathVariable Long id) {
        cookieService.deleteCookie(id);
        return ResponseEntity.ok(Map.of("message", "Cookie deleted successfully"));
    }
}
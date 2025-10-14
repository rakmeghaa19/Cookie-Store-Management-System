package com.examly.springapp.service;

import com.examly.springapp.model.Cookie;
import com.examly.springapp.repository.CookieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CookieService {

    @Autowired
    private CookieRepository cookieRepository;

    public Cookie saveCookie(Cookie cookie) {
        return cookieRepository.save(cookie);
    }

    public List<Cookie> getAllCookies() {
        return cookieRepository.findAll();
    }

    public Page<Cookie> getCookiesPaginated(Pageable pageable) {
        return cookieRepository.findAll(pageable);
    }

    public List<Cookie> getCookiesByFlavor(String flavor) {
        return cookieRepository.findByFlavor(flavor);
    }

    public List<Cookie> getCookiesSortedByPrice() {
        return cookieRepository.findAllByOrderByPriceAsc();
    }

    public Cookie updateCookie(Long id, Cookie cookie) {
        Cookie existing = cookieRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cookie not found"));
        existing.setCookieName(cookie.getCookieName());
        existing.setFlavor(cookie.getFlavor());
        existing.setPrice(cookie.getPrice());
        existing.setQuantityAvailable(cookie.getQuantityAvailable());
        return cookieRepository.save(existing);
    }

    public Cookie getCookieById(Long id) {
        return cookieRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cookie not found with id: " + id));
    }

    public List<Cookie> searchCookiesByName(String name) {
        return cookieRepository.findByCookieNameContainingIgnoreCase(name);
    }

    public void deleteCookie(Long id) {
        if (!cookieRepository.existsById(id)) {
            throw new RuntimeException("Cookie not found with id: " + id);
        }
        cookieRepository.deleteById(id);
    }
}
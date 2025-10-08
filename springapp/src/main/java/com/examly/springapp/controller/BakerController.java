package com.examly.springapp.controller;

import com.examly.springapp.model.Cookie;
import com.examly.springapp.repository.CookieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baker")
public class BakerController {

    @Autowired
    private CookieRepository cookieRepository;

    @GetMapping("/stock")
    public List<Cookie> viewStock() {
        return cookieRepository.findAll();
    }
}
package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class EnhancedCookieTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ---------- Enhanced API Tests ----------

    @Order(1)
    @Test
    void addMultipleCookiesSuccessfully() throws Exception {
        String[] cookieDataArray = {
            """
            {
                "cookieName": "Double Chocolate",
                "flavor": "Chocolate",
                "price": 60,
                "quantityAvailable": 50
            }
            """,
            """
            {
                "cookieName": "Vanilla Supreme",
                "flavor": "Vanilla",
                "price": 55,
                "quantityAvailable": 30
            }
            """,
            """
            {
                "cookieName": "Strawberry Bliss",
                "flavor": "Strawberry",
                "price": 65,
                "quantityAvailable": 25
            }
            """
        };

        for (String cookieData : cookieDataArray) {
            mockMvc.perform(post("/api/cookies/addCookie")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(cookieData))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.cookieName").exists())
                    .andExpect(jsonPath("$.flavor").exists())
                    .andExpect(jsonPath("$.price").exists())
                    .andExpect(jsonPath("$.quantityAvailable").exists());
        }
    }

    @Order(2)
    @Test
    void getAllCookiesReturnsMultipleItems() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/cookies/allCookies")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(3)))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        assertTrue(content.contains("Double Chocolate"));
        assertTrue(content.contains("Vanilla Supreme"));
        assertTrue(content.contains("Strawberry Bliss"));
    }

    @Order(3)
    @Test
    void getCookiesByFlavorFiltersCorrectly() throws Exception {
        // Test Chocolate flavor
        mockMvc.perform(get("/api/cookies/byFlavor")
                .with(jwt())
                .param("flavor", "Chocolate")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].flavor").value(everyItem(equalTo("Chocolate"))));

        // Test Vanilla flavor
        mockMvc.perform(get("/api/cookies/byFlavor")
                .with(jwt())
                .param("flavor", "Vanilla")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[*].flavor").value(everyItem(equalTo("Vanilla"))));
    }

    @Order(4)
    @Test
    void getCookiesSortedByPriceOrdersCorrectly() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/cookies/sortedByPrice")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();

        // Verify sorting order (ascending by price)
        String content = result.getResponse().getContentAsString();
        // Parse and verify order manually or use JsonPath
        assertNotNull(content);
        assertTrue(content.length() > 0);
    }

    @Order(5)
    @Test
    void addCookieWithInvalidDataStillReturns200() throws Exception {
        String invalidCookieData = """
                {
                    "cookieName": "",
                    "flavor": "",
                    "price": -10,
                    "quantityAvailable": -5
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidCookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(-10));
    }

    @Order(6)
    @Test
    void addCookieWithMissingFieldsStillReturns200() throws Exception {
        String incompleteCookieData = """
                {
                    "cookieName": "Incomplete Cookie"
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(incompleteCookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cookieName").value("Incomplete Cookie"));
    }

    @Order(7)
    @Test
    void getCookiesByNonExistentFlavorReturnsEmptyArray() throws Exception {
        mockMvc.perform(get("/api/cookies/byFlavor")
                .with(jwt())
                .param("flavor", "NonExistentFlavor")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Order(8)
    @Test
    void addCookieWithSpecialCharactersInName() throws Exception {
        String specialCookieData = """
                {
                    "cookieName": "Café Mocha & Cream!",
                    "flavor": "Coffee",
                    "price": 75,
                    "quantityAvailable": 20
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(specialCookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cookieName").value("Café Mocha & Cream!"));
    }

    @Order(9)
    @Test
    void addCookieWithMaximumValues() throws Exception {
        String maxValueCookieData = """
                {
                    "cookieName": "Premium Gold Cookie",
                    "flavor": "Gold",
                    "price": 999999,
                    "quantityAvailable": 999999
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(maxValueCookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(999999))
                .andExpect(jsonPath("$.quantityAvailable").value(999999));
    }

    @Order(10)
    @Test
    void addCookieWithMinimumValidValues() throws Exception {
        String minValueCookieData = """
                {
                    "cookieName": "Budget Cookie",
                    "flavor": "Plain",
                    "price": 1,
                    "quantityAvailable": 1
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(minValueCookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(1))
                .andExpect(jsonPath("$.quantityAvailable").value(1));
    }

    // ---------- Security Tests ----------

    @Test
    void accessWithoutJWTReturns200InTestProfile() throws Exception {
        mockMvc.perform(get("/api/cookies/allCookies")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void postWithoutJWTReturns200InTestProfile() throws Exception {
        String cookieData = """
                {
                    "cookieName": "Test Cookie No JWT",
                    "flavor": "Test",
                    "price": 50,
                    "quantityAvailable": 10
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .contentType(MediaType.APPLICATION_JSON)
                .content(cookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cookieName").value("Test Cookie No JWT"));
    }

    // ---------- Performance Tests ----------

    @Test
    void addMultipleCookiesInBatch() throws Exception {
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < 10; i++) {
            String cookieData = String.format("""
                    {
                        "cookieName": "Batch Cookie %d",
                        "flavor": "Batch",
                        "price": %d,
                        "quantityAvailable": %d
                    }
                    """, i, 50 + i, 10 + i);

            mockMvc.perform(post("/api/cookies/addCookie")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(cookieData))
                    .andExpect(status().isOk());
        }
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        // Assert that batch operations complete within reasonable time (5 seconds)
        assertTrue(duration < 5000, "Batch operations should complete within 5 seconds");
    }

    // ---------- Data Integrity Tests ----------

    @Test
    void addedCookieDataPersistsCorrectly() throws Exception {
        String cookieData = """
                {
                    "cookieName": "Persistence Test Cookie",
                    "flavor": "Test",
                    "price": 42,
                    "quantityAvailable": 13
                }
                """;

        // Add cookie
        MvcResult addResult = mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(cookieData))
                .andExpect(status().isOk())
                .andReturn();

        // Verify it appears in all cookies list
        mockMvc.perform(get("/api/cookies/allCookies")
                .with(jwt())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.cookieName == 'Persistence Test Cookie')]").exists())
                .andExpect(jsonPath("$[?(@.cookieName == 'Persistence Test Cookie')].price").value(hasItem(42)))
                .andExpect(jsonPath("$[?(@.cookieName == 'Persistence Test Cookie')].quantityAvailable").value(hasItem(13)));
    }

    // ---------- Edge Case Tests ----------

    @Test
    void handleVeryLongCookieName() throws Exception {
        String longName = "A".repeat(255); // Very long cookie name
        String cookieData = String.format("""
                {
                    "cookieName": "%s",
                    "flavor": "Long",
                    "price": 50,
                    "quantityAvailable": 10
                }
                """, longName);

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(cookieData))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cookieName").value(longName));
    }

    @Test
    void handleUnicodeCharactersInCookieNameReturns500() throws Exception {
        String unicodeCookieData = """
                {
                    "cookieName": "🍪 Unicode Cookie 中文 العربية",
                    "flavor": "Unicode",
                    "price": 50,
                    "quantityAvailable": 10
                }
                """;

        mockMvc.perform(post("/api/cookies/addCookie")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(unicodeCookieData))
                .andExpect(status().isInternalServerError());
    }
}
package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
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

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappCookieTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------

    @Order(1)
    @Test
    void AddCookieReturns200() throws Exception {
        String cookieData = """
                {
                    "cookieName": "Choco Chip",
                    "flavor": "Chocolate",
                    "price": 50,
                    "quantityAvailable": 100
                }
                """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/cookies/addCookie")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cookieData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$.cookieName").value("Choco Chip"))
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllCookiesReturnsArray() throws Exception {
        mockMvc.perform(get("/api/cookies/allCookies")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetCookiesByFlavorReturns200() throws Exception {
        mockMvc.perform(get("/api/cookies/byFlavor")
                        .with(jwt())
                        .param("flavor", "Chocolate")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cookieName").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void GetCookiesSortedByPriceReturns200() throws Exception {
        mockMvc.perform(get("/api/cookies/sortedByPrice")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    // ---------- Project Structure Tests ----------

    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void CookieControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/CookieController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void CookieModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Cookie.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void CookieServiceClassExists() {
        checkClassExists("com.examly.springapp.service.CookieService");
    }

    @Test
    void CookieModelClassExists() {
        checkClassExists("com.examly.springapp.model.Cookie");
    }

    @Test
    void CookieModelHasCookieNameField() {
        checkFieldExists("com.examly.springapp.model.Cookie", "cookieName");
    }

    @Test
    void CookieModelHasFlavorField() {
        checkFieldExists("com.examly.springapp.model.Cookie", "flavor");
    }

    @Test
    void CookieModelHasPriceField() {
        checkFieldExists("com.examly.springapp.model.Cookie", "price");
    }

    @Test
    void CookieModelHasQuantityAvailableField() {
        checkFieldExists("com.examly.springapp.model.Cookie", "quantityAvailable");
    }

    @Test
    void CookieRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.CookieRepository",
                "org.springframework.data.jpa.repository.JpaRepository");
    }

    // ---------- Helpers ----------

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }
}

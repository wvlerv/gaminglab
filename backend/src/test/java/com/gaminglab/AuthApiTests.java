package com.gaminglab;

import com.gaminglab.auth.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:auth-api-tests;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class AuthApiTests {
    @Autowired MockMvc mvc;
    @Autowired UserRepository users;

    @BeforeEach
    void cleanUsers() { users.deleteAll(); }

    @Test
    void signsUpLogsInAndLogsOut() throws Exception {
        mvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"Daria","lastName":"Uzenkova","email":"daria@gmail.com","password":"12345678","acceptedTerms":true}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.accessToken").isString())
            .andExpect(jsonPath("$.tokenType").value("Bearer"))
            .andExpect(jsonPath("$.user.email").value("daria@gmail.com"));

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"daria@gmail.com","password":"12345678","rememberMe":false}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").isString());

        mvc.perform(post("/api/auth/logout"))
            .andExpect(status().isNoContent());
    }

    @Test
    void rejectsShortPasswordAndDuplicateSignup() throws Exception {
        mvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"A","lastName":"B","email":"a@b.com","password":"12345678","acceptedTerms":true}
                    """))
            .andExpect(status().isCreated());

        mvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"A","lastName":"B","email":"a@b.com","password":"12345678","acceptedTerms":true}
                    """))
            .andExpect(status().isBadRequest());
    }
}

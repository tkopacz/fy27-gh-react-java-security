package com.example.demo.order;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsOrderForValidRequest() throws Exception {
        String body = """
                {
                  \"productId\": 1,
                  \"quantity\": 2,
                  \"firstName\": \"Ada\",
                  \"lastName\": \"Lovelace\",
                  \"email\": \"ada@example.com\",
                  \"phone\": \"123456789\",
                  \"deliveryAddress\": \"10 Downing Street\"
                }
                """;

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void rejectsInvalidOrderPayload() throws Exception {
        String body = """
                {
                  \"productId\": 1,
                  \"quantity\": 0,
                  \"firstName\": \"\",
                  \"lastName\": \"\",
                  \"email\": \"not-an-email\",
                  \"phone\": \"\",
                  \"deliveryAddress\": \"\"
                }
                """;

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }
}

package com.example.demo.securitydemo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;

public class SafeJsonParsing {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode parse(InputStream inputStream) throws IOException {
        return objectMapper.readTree(inputStream);
    }
}

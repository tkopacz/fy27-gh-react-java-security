package com.example.demo.securitydemo;

public class SafeSqlExample {
    public String buildQuery(String username) {
        return "SELECT * FROM users WHERE username = ?";
    }
}

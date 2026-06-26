package com.example.demo.securitydemo;

public class VulnerableSqlExample {
    // DEMO ONLY - intentionally vulnerable
    public String buildQuery(String username) {
        return "SELECT * FROM users WHERE username = '" + username + "'";
    }
}

package com.example.demo.securitydemo;

import java.nio.file.Path;

public class VulnerableFileDownload {
    // DEMO ONLY - intentionally vulnerable
    public Path resolveFile(String fileName) {
        return Path.of("/tmp/" + fileName);
    }
}

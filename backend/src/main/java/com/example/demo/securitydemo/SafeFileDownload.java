package com.example.demo.securitydemo;

import java.nio.file.Path;

public class SafeFileDownload {
    public Path resolveFile(String fileName) {
        Path baseDir = Path.of("/tmp/downloads").toAbsolutePath().normalize();
        Path requestedPath = Path.of(fileName).normalize();
        Path resolved = baseDir.resolve(requestedPath).normalize();

        if (!resolved.startsWith(baseDir)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        return resolved;
    }
}

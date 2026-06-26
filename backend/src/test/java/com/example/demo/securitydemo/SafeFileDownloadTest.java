package com.example.demo.securitydemo;

import org.junit.jupiter.api.Test;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SafeFileDownloadTest {
    @Test
    void allowsFilesInsideTheDownloadDirectory() {
        SafeFileDownload safeFileDownload = new SafeFileDownload();
        Path resolved = safeFileDownload.resolveFile("report.pdf");

        assertEquals(Path.of("/tmp/downloads/report.pdf").normalize(), resolved);
    }

    @Test
    void blocksTraversalOutsideTheDownloadDirectory() {
        SafeFileDownload safeFileDownload = new SafeFileDownload();
        assertThrows(IllegalArgumentException.class, () -> safeFileDownload.resolveFile("../../etc/passwd"));
    }
}

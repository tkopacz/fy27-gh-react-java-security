package com.example.demo.securitydemo;

import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;

public class VulnerableDeserialization {
    // DEMO ONLY - intentionally vulnerable
    public Object deserialize(InputStream inputStream) throws IOException, ClassNotFoundException {
        try (ObjectInputStream objectInputStream = new ObjectInputStream(inputStream)) {
            return objectInputStream.readObject();
        }
    }
}

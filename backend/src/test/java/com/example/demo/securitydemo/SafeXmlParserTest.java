package com.example.demo.securitydemo;

import org.junit.jupiter.api.Test;
import org.w3c.dom.Document;

import static org.junit.jupiter.api.Assertions.assertThrows;

class SafeXmlParserTest {
    @Test
    void rejectsDoctypeDeclarations() {
        SafeXmlParser parser = new SafeXmlParser();
        String xml = "<!DOCTYPE foo [<!ENTITY xxe SYSTEM 'file:///etc/passwd'>]><root>&xxe;</root>";

        assertThrows(Exception.class, () -> parser.parse(xml));
    }

    @Test
    void parsesSimpleXml() throws Exception {
        SafeXmlParser parser = new SafeXmlParser();
        Document document = parser.parse("<root><message>ok</message></root>");

        assert document.getElementsByTagName("message").getLength() == 1;
    }
}

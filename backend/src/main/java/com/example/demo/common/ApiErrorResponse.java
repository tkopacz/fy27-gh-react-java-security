package com.example.demo.common;

import java.util.List;

public record ApiErrorResponse(String message, List<ValidationError> fieldErrors) {
}

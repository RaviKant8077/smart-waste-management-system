package com.example.smart.waste.management.security;

import org.springframework.lang.NonNull;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public interface JwtAuthenticationFilter1 {
    void doFilterInternal(
            @NonNull HttpServletRequest request
    ) throws ServletException, IOException;
}

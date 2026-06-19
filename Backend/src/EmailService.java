package com.interviewprep.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String to, String token) {
        // Email disabled - print to console for development
        System.out.println("=== PASSWORD RESET ===");
        System.out.println("To: " + to);
        System.out.println("Token: " + token);
        System.out.println("Reset URL: http://localhost:3000/reset-password?token=" + token);
        System.out.println("======================");
    }

    public void sendInterviewResultEmail(String to, String name, double score) {
        System.out.println("=== INTERVIEW RESULT ===");
        System.out.println("To: " + to + " | Score: " + score + "%");
        System.out.println("========================");
    }
}

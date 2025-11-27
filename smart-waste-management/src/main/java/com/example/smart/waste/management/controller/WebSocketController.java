package com.example.smart.waste.management.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/tracking")
    @SendTo("/topic/tracking")
    public String handleTracking(String message) {
        // Handle real-time tracking messages
        return message;
    }
}

package com.example.es.controller;

import com.example.es.dto.ChatRequest;
import com.example.es.dto.ChatResponse;
import com.example.es.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String response = chatService.getChatResponse(request.getMessage(), request.getSkinType());
        return new ChatResponse(response);
    }
}

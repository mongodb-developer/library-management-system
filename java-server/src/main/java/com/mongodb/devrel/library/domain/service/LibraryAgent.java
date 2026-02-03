package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.response.AgentResponse;
import com.mongodb.devrel.library.domain.model.User;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LibraryAgent {

    private final ChatClient chatClient;
    private final LibraryTools libraryTools;

    public LibraryAgent(ChatClient chatClient, LibraryTools libraryTools) {
        this.chatClient = chatClient;
        this.libraryTools = libraryTools;
    }

    public AgentResponse run(User user, String input) {

        // The model will call tools sequentially if needed.
        // Your job: expose the tools + give tight instructions.
        String answer = chatClient.prompt()
                .system("""
                    You are a library assistant that can perform actions using tools.

                    Rules:
                    - Use tools when the user asks for an action (reserve/hold, view my borrowed/reserved, check a specific book id).
                    - If you need a book id and the user didn't provide one, ask a clarifying question.
                    - Do NOT invent user/account/book data. Use tools for facts.
                    - Keep responses short and practical.
                    """)
                .user(input)
                // Make tool methods available to the model
                .tools(libraryTools)
                // Provide user identity without sending it to the model
                .toolContext(Map.of("user", user))
                .call()
                .content();

        return new AgentResponse(answer);
    }
}

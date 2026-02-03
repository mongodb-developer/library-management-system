package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.AgentResponse;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.LibraryAgent;
import com.mongodb.devrel.library.infrastructure.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final LibraryAgent libraryAgent;
    private final UserRepository userRepository;

    public AgentController(LibraryAgent libraryAgent, UserRepository userRepository) {
        this.libraryAgent = libraryAgent;
        this.userRepository = userRepository;
    }

    @PostMapping("/ask")
    public AgentResponse ask(@RequestParam("userId") String userId,
                             @RequestParam("query") String query) {
        User loggedInUser = userRepository.findById(new ObjectId(userId)).orElseThrow();
        return libraryAgent.run(loggedInUser, query);
    }

}

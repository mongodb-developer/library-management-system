package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.RagResponse;
import com.mongodb.devrel.library.domain.service.LibraryAssistant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assistant")
public class RagController {

    private final LibraryAssistant libraryAssistant;

    public RagController(LibraryAssistant libraryAssistant) {
        this.libraryAssistant = libraryAssistant;
    }

    @PostMapping("/query")
    public ResponseEntity<RagResponse> ask(@RequestParam String query) {
        return new ResponseEntity<>(libraryAssistant.askLibraryAssistant(query), HttpStatus.OK);
    }

}

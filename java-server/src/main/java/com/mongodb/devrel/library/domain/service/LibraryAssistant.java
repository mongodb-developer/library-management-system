package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.response.RagResponse;
import com.mongodb.devrel.library.domain.model.Book;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.Query;
import org.springframework.ai.rag.retrieval.search.DocumentRetriever;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryAssistant {

    private final Advisor ragAdvisor;
    private final ChatClient chatClient;
    private final DocumentRetriever retriever;
    private final BookLookupService bookLookupService;

    public LibraryAssistant(Advisor ragAdvisor, ChatClient openAiChatClient, DocumentRetriever retriever, BookLookupService bookLookupService) {
        this.ragAdvisor = ragAdvisor;
        this.chatClient = openAiChatClient;
        this.retriever = retriever;
        this.bookLookupService = bookLookupService;
    }

    public RagResponse askLibraryAssistant(String question) {

        // 1. Retrieve documents manually
        List<Document> docs = retriever.retrieve(new Query(question));
        List<Book> ordered = bookLookupService.resolveRankedBooks(docs);

        // 2. Generate the RAG answer (advisor will re-use retriever)
        String answer = chatClient.prompt()
                .advisors(ragAdvisor)
                .user(question)
                .call()
                .content();

        return new RagResponse(answer, ordered);
    }
}

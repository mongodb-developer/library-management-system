package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.response.RagResponse;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.Query;
import org.springframework.ai.rag.retrieval.search.DocumentRetriever;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LibraryAssistant {

    private final Advisor ragAdvisor;
    private final ChatClient chatClient;
    private final DocumentRetriever retriever;
    private final BookRepository bookRepository;

    public LibraryAssistant(Advisor ragAdvisor, ChatClient openAiChatClient, DocumentRetriever retriever, BookRepository bookRepository) {
        this.ragAdvisor = ragAdvisor;
        this.chatClient = openAiChatClient;
        this.retriever = retriever;
        this.bookRepository = bookRepository;
    }

    public RagResponse askLibraryAssistant(String question) {

        // 1. Retrieve documents manually
        List<Document> docs = retriever.retrieve(new Query(question));

        // Extract IDs
        List<String> ids = docs.stream()
                .map(d -> d.getMetadata().get("id").toString())
                .toList();

        List<Book> found = bookRepository.findAllById(ids);

        // preserve vector ranking
        Map<String, Book> byId = found.stream()
                .collect(Collectors.toMap(Book::id, b -> b));

        List<Book> ordered = ids.stream().map(byId::get).toList();

        // 2. Generate the RAG answer (advisor will re-use retriever)
        String answer = chatClient.prompt()
                .advisors(ragAdvisor)
                .user(question)
                .call()
                .content();

        // 3. Return both
        return new RagResponse(answer, ordered);
    }
}

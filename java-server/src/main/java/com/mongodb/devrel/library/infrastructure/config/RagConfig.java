package com.mongodb.devrel.library.infrastructure.config;

import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.generation.augmentation.ContextualQueryAugmenter;
import org.springframework.ai.rag.retrieval.search.DocumentRetriever;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.template.st.StTemplateRenderer;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RagConfig {

    private final VectorStore vectorStore;

    public RagConfig(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    // Shared retriever used by your service AND by the advisor
    @Bean
    public DocumentRetriever documentRetriever() {
        return VectorStoreDocumentRetriever.builder()
                .vectorStore(vectorStore)
                .similarityThreshold(0.5)
                .topK(6)
                .build();
    }

    @Bean
    public PromptTemplate ragPromptTemplate() {
        return PromptTemplate.builder()
                .renderer(StTemplateRenderer.builder()
                        .startDelimiterToken('<')
                        .endDelimiterToken('>')
                        .build())
                .template("""
                    You are a knowledgeable and helpful librarian.
                
                    The patron has asked the following question:
                    "<query>"
                
                    First, identify the core subject of the patron’s question 
                    (for example, turn “books about basketball” into “basketball”).
                
                    Below are the books and materials available in the library related to that subject:
                
                    ---------------------
                    <context>
                    ---------------------
                
                    Using only the information in these materials, respond like a librarian:
                
                    • Begin with: “Yes, we have books related to [subject].”  
                      Replace [subject] with the clean topic you identified.
                
                    • Then explain briefly what subjects or themes these books cover.
                
                    • If there are no relevant books, say:
                      “We don’t appear to have books that answer that directly.”
                
                    • Keep the tone friendly, professional, and concise.
                    • Do NOT invent details not present in the material.
                    • Do NOT mention the context or the process.
                    """)
                .build();
    }

    // Single RAG advisor using the same retriever
    @Bean
    public Advisor ragAdvisor(DocumentRetriever retriever) {
        return RetrievalAugmentationAdvisor.builder()
                .documentRetriever(retriever)
                .queryAugmenter(ContextualQueryAugmenter.builder()
                        .promptTemplate(ragPromptTemplate())
                        .allowEmptyContext(true)
                        .build()
                    )
                .build();
    }
}

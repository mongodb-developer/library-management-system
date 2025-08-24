package com.mongodb.devrel.library.infrastructure.provider;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.devrel.library.domain.provider.EmbeddingProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.servless.ServerlessEmbeddingClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ServerlessEmbeddingProvider implements EmbeddingProvider {

    private static final Logger log = LoggerFactory.getLogger(ServerlessEmbeddingProvider.class);

    private final ServerlessEmbeddingClient phoenixClient;

    public ServerlessEmbeddingProvider(ServerlessEmbeddingClient phoenixClient) {
        this.phoenixClient = phoenixClient;
    }

    @Override
    public List<Double> getEmbeddings(String text) {
        try {
            log.info("Sending data to serverlessEndpoint embedding client ..");

            String response = phoenixClient.getEmbeddings(text);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Error getting embeddings from Phoenix", e);
            return List.of();
        }
    }

    @Override
    public String name() {
        return "serverlessEndpoint";
    }
}

package com.mongodb.devrel.library.infrastructure.provider;

import com.mongodb.devrel.library.application.web.controller.BorrowsController;
import com.mongodb.devrel.library.domain.provider.EmbeddingProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingClient;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingRequest;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VertexEmbeddingProvider implements EmbeddingProvider {

	private static final Logger log = LoggerFactory.getLogger(VertexEmbeddingProvider.class);

	private final VertexEmbeddingClient embeddingClient;
	private final String bearerToken;
	private final String projectId;
	private final String model;

	public VertexEmbeddingProvider(VertexEmbeddingClient embeddingClient,
								   @Value("${vertex.api-key}") String bearerToken,
								   @Value("${vertex.project-id}")String projectId,
								   @Value("${vertex.model}")String model
	) {
		this.embeddingClient = embeddingClient;
		this.bearerToken = bearerToken;
		this.projectId = projectId;
		this.model = model;
	}

	@Override
	public List<Double> getEmbeddings(String text) {
		try {
			log.info("Sending data to Vertex embedding client ..");

			VertexEmbeddingRequest request = VertexEmbeddingRequest.ofText(text);
			VertexEmbeddingResponse response = embeddingClient.predict("Bearer " + bearerToken, projectId, model, request);

			return extractEmbeddings(response);
		} catch (Exception e) {
			log.error("Failed to get embeddings from Vertex embedding client ", e);
			return List.of();
		}
	}
	public List<Double> extractEmbeddings(VertexEmbeddingResponse response) {
		if (response.predictions() == null || response.predictions().isEmpty()) {
			return List.of();
		}

		Object embeddingsObj = response.predictions().getFirst().get("textEmbedding");
		if (embeddingsObj instanceof List<?> list) {
			return list.stream()
					.filter(Double.class::isInstance)
					.map(Double.class::cast)
					.toList();
		}

		return List.of();
	}
	@Override
	public String name() {
		return "googleVertex";
	}
}

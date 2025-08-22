package com.mongodb.devrel.library.infrastructure.providers;

import com.mongodb.devrel.library.domain.provider.EmbeddedProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingClient;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingRequest;
import com.mongodb.devrel.library.infrastructure.embeddings.vertex.VertexEmbeddingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VertexEmbeddingsProvider implements EmbeddedProvider {

	private final VertexEmbeddingClient embeddingClient;
	private final String bearerToken;
	private final String projectId;
	private final String model;

	public VertexEmbeddingsProvider(VertexEmbeddingClient embeddingClient,
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

			VertexEmbeddingRequest request = VertexEmbeddingRequest.ofText(text);
			VertexEmbeddingResponse response = embeddingClient.predict(bearerToken, projectId, model, request);

			return extractEmbeddings(response);
		} catch (Exception e) {
			System.err.println("Failed Vertex AI: " + e.getMessage());
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

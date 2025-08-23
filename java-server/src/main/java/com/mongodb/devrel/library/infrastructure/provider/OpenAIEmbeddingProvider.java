package com.mongodb.devrel.library.infrastructure.provider;

import com.mongodb.devrel.library.domain.provider.EmbeddingProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingClient;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingRequest;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OpenAIEmbeddingProvider implements EmbeddingProvider {

	private static final Logger log = LoggerFactory.getLogger(OpenAIEmbeddingProvider.class);
	private final OpenAIEmbeddingClient client;
	private final String model;

	public OpenAIEmbeddingProvider(
			OpenAIEmbeddingClient client,
			@Value("${openai.model:text-embedding-3-small}") String model) {
		this.client = client;
		this.model = model;
	}

	@Override
	public List<Double> getEmbeddings(String text) {
		log.info("Sending data to OPENAI embedding client ..");

		OpenAIEmbeddingResponse resp =
				client.createEmbeddings(new OpenAIEmbeddingRequest(model, text));

		if (resp == null || resp.data() == null || resp.data().isEmpty()) {
			throw new IllegalStateException("Empty embeddings response from OpenAI");
		}
		return resp.data().getFirst().embedding();
	}

	@Override
	public String name() {
		return "openai";
	}
}

package com.mongodb.devrel.library.infrastructure.providers;

import com.mongodb.devrel.library.domain.provider.EmbeddedProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingsClient;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingsRequest;
import com.mongodb.devrel.library.infrastructure.embeddings.openai.OpenAIEmbeddingsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OpenAIEmbeddingsProvider implements EmbeddedProvider {

	private final OpenAIEmbeddingsClient client;
	private final String model;

	public OpenAIEmbeddingsProvider(
			OpenAIEmbeddingsClient client,
			@Value("${openai.model:text-embedding-3-small}") String model) {
		this.client = client;
		this.model = model;
	}

	@Override
	public List<Double> getEmbeddings(String text) {
		OpenAIEmbeddingsResponse resp =
				client.createEmbeddings(new OpenAIEmbeddingsRequest(model, text));

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

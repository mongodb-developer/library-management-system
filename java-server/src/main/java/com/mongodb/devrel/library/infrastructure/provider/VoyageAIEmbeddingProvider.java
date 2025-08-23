package com.mongodb.devrel.library.infrastructure.provider;

import com.mongodb.devrel.library.domain.provider.EmbeddingProvider;
import com.mongodb.devrel.library.infrastructure.embeddings.voyageai.VoyageEmbeddingsRequest;
import com.mongodb.devrel.library.infrastructure.embeddings.voyageai.VoyageEmbeddingsClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VoyageAIEmbeddingProvider implements EmbeddingProvider {
	private static final Logger log = LoggerFactory.getLogger(VoyageAIEmbeddingProvider.class);

	private final VoyageEmbeddingsClient voyageEmbeddingsClient;
	private final String model;
	private final int dimension;

	public VoyageAIEmbeddingProvider(
			VoyageEmbeddingsClient voyageEmbeddingsClient,
			@Value("${voyage.model}") String model,
			@Value("${voyage.output-dimension}") int dimension
	) {
		this.voyageEmbeddingsClient = voyageEmbeddingsClient;
		this.model = model;
		this.dimension = dimension;
	}

	@Override
	public List<Double> getEmbeddings(String text) {
		log.info("Sending data to VOYAGE AI embedding client ..");

		var res = voyageEmbeddingsClient.getEmbeddings(new VoyageEmbeddingsRequest(
				List.of(text), model, "query", dimension));

		return res.data().getFirst().embedding();
 	}

	@Override
	public String name() {
		return "voyage";
	}
}

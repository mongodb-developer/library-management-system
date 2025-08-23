package com.mongodb.devrel.library.infrastructure.embeddings.voyageai;

import java.util.List;

public record VoyageEmbeddingsRequest(
    List<String> input,
    String model,
    String input_type,
    Integer output_dimension
) {}
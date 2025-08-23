package com.mongodb.devrel.library.infrastructure.embeddings.openai;

import java.util.List;

public record OpenAIEmbeddingResponse(List<Data> data) {
    public record Data(List<Double> embedding, Integer index) {}
}

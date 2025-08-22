package com.mongodb.devrel.library.infrastructure.embeddings.vertex;

import java.util.List;

public record VertexEmbeddingRequest(List<Instance> instances) {
    public static VertexEmbeddingRequest ofText(String text) {
        return new VertexEmbeddingRequest(List.of(new Instance(text)));
    }
    public record Instance(String text) {}
}

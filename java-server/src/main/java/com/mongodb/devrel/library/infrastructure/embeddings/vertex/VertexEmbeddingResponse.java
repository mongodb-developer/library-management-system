package com.mongodb.devrel.library.infrastructure.embeddings.vertex;

import java.util.List;
import java.util.Map;

public record VertexEmbeddingResponse(List<Map<String, Object>> predictions) {}

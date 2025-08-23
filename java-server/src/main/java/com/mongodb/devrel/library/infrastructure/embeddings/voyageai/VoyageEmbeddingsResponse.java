package com.mongodb.devrel.library.infrastructure.embeddings.voyageai;

import java.util.List;

public record VoyageEmbeddingsResponse(List<Item> data) {
  public record Item(List<Double> embedding) {}
}
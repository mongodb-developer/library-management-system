package com.mongodb.devrel.library.infrastructure.provider;

import com.mongodb.devrel.library.domain.provider.EmbeddingProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Primary
class RoutingEmbeddingProvider implements EmbeddingProvider {
  private final Map<String, EmbeddingProvider> providers;
  private final String source;

  RoutingEmbeddingProvider(List<EmbeddingProvider> impls, @Value("${embeddings.source}") String source) {
    this.providers = impls.stream().collect(Collectors.toMap(EmbeddingProvider::name, p -> p));
    this.source = source;
  }
  public List<Double> getEmbeddings(String text) { return providers.get(source).getEmbeddings(text); }
  public String name() { return "router"; }
}
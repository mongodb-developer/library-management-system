package com.mongodb.devrel.library.infrastructure.providers;

import com.mongodb.devrel.library.domain.provider.EmbeddedProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Primary
class RoutingEmbeddingsProvider implements EmbeddedProvider {
  private final Map<String, EmbeddedProvider> providers;
  private final String source;

  RoutingEmbeddingsProvider(List<EmbeddedProvider> impls, @Value("${embeddings.source}") String source) {
    this.providers = impls.stream().collect(Collectors.toMap(EmbeddedProvider::name, p -> p));
    this.source = source;
  }
  public List<Double> getEmbeddings(String text) { return providers.get(source).getEmbeddings(text); }
  public String name() { return "router"; }
}
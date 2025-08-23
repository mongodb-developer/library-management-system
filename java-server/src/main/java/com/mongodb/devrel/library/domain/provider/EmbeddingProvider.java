package com.mongodb.devrel.library.domain.provider;

import java.util.List;

public interface EmbeddingProvider {
    List<Double> getEmbeddings(String text);
    String name();
}
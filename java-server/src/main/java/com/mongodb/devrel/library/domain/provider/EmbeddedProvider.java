package com.mongodb.devrel.library.domain.provider;

import java.util.List;

public interface EmbeddedProvider {
    List<Double> getEmbeddings(String text);
    String name();
}
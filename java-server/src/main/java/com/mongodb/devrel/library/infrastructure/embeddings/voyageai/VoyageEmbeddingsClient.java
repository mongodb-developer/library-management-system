package com.mongodb.devrel.library.infrastructure.embeddings.voyageai;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "voyage",
        url = "${voyage.base-url}",
        configuration = VoyageFeignInterceptor.class
)
public interface VoyageEmbeddingsClient {
  @PostMapping("/embeddings")
  VoyageEmbeddingsResponse getEmbeddings(@RequestBody VoyageEmbeddingsRequest body);
}
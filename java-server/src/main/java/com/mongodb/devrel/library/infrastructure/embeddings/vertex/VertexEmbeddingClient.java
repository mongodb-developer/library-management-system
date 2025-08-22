package com.mongodb.devrel.library.infrastructure.embeddings.vertex;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
        name = "vertex-embeddings",
        url = "${vertex.base-url}"
)
public interface VertexEmbeddingClient {

    @PostMapping(
            value = "/v1/projects/{projectId}/locations/us-central1/publishers/google/models/{model}:predict",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    VertexEmbeddingResponse predict(
            @RequestHeader("Authorization") String bearerToken,
            @PathVariable("projectId") String projectId,
            @PathVariable("model") String model,
            @RequestBody VertexEmbeddingRequest request
    );
}

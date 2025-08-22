package com.mongodb.devrel.library.infrastructure.embeddings.openai;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "openai-embeddings",
    url = "${openai.base-url}",
    configuration = OpenAIFeignConfig.class
)
public interface OpenAIEmbeddingsClient {

    @PostMapping(value = "/v1/embeddings", consumes = "application/json", produces = "application/json")
    OpenAIEmbeddingsResponse createEmbeddings(@RequestBody OpenAIEmbeddingsRequest request);
}
package com.mongodb.devrel.library.infrastructure.embeddings.servless;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
    name = "phoenix-embeddings",
    url = "${serverlessEndpoint.base-url}"
)
public interface ServerlessEmbeddingClient {

    @GetMapping("/getEmbeddings/embeddings")
    String getEmbeddings(@RequestParam("arg") String arg);
}

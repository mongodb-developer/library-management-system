package com.mongodb.devrel.library.infrastructure.embeddings.openai;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIFeignConfig {

    @Value("${openai.api-key}")
    private String apiKey;

    @Bean
    public RequestInterceptor openAiAuthInterceptor() {
        return template -> {
            template.header("Authorization", "Bearer " + apiKey);
            template.header("Content-Type", "application/json");
        };
    }
}

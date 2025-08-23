package com.mongodb.devrel.library.infrastructure.embeddings.voyageai;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VoyageFeignInterceptor {

		@Bean
		public RequestInterceptor voyageAuthInterceptor(@Value("${voyage.api-key}") String key) {
		return tpl -> tpl.header("Authorization", "Bearer " + key)
				.header("Content-Type", "application/json");
		}
}

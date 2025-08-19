package com.mongodb.devrel.library.infrastructure.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SchemaValidationConfig {


	private static final Logger log = LoggerFactory.getLogger(SchemaValidationConfig.class);

	@Bean
	ApplicationRunner applyUserSchemaValidation(
			MongoClient mongoClient,
			@Value("${spring.data.mongodb.database}") String databaseName) {

		return args -> {
			// TODO
		};
	}
}

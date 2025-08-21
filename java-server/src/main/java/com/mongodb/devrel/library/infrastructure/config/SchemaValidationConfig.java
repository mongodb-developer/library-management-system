package com.mongodb.devrel.library.infrastructure.config;

import com.mongodb.MongoCommandException;
import com.mongodb.MongoWriteException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SchemaValidationConfig {

	private static final Logger log = LoggerFactory.getLogger(SchemaValidationConfig.class);
	private static final String COLLECTION_NAME = "users";

	enum SchemaMode { APPLY, TEST }

	@Bean
	@ConditionalOnProperty(name = "lab.schema-mode")
	ApplicationRunner execute(
			MongoClient mongoClient,
			@Value("${spring.data.mongodb.database}") String databaseName,
			@Value("${lab.schema-mode}") String modeRaw
	) {
		return args -> {

			SchemaMode mode = parseMode(modeRaw);
			MongoDatabase db = mongoClient.getDatabase(databaseName);

			switch (mode) {
				case APPLY -> applySchema(db);
				case TEST -> testSchema(db);
			}
		};
	}

	private void applySchema(MongoDatabase db) {
		log.info("Applying schema validation on users collection ..");

		Document userSchema = new Document("$jsonSchema", new Document()
				.append("bsonType", "object")
				.append("required", List.of("name", "isAdmin"))
				.append("properties", new Document()
						.append("name", new Document("bsonType", "string")
								.append("minLength", 5)
								.append("description", "must be a string and is required"))
						.append("isAdmin", new Document("bsonType", "bool")
								.append("description", "must be a boolean and is required"))
				)
		);

		Document command = new Document("collMod", COLLECTION_NAME)
				.append("validator", userSchema)
				.append("validationLevel", "strict")
				.append("validationAction", "error");

		try {
			Document result = db.runCommand(command);
			Number ok = result.get("ok", Number.class);
			if (ok == null) {
				log.error("Failed to enable schema validation! Result: {}", result.toJson());
				System.exit(1);
			} else {
				log.info("User collection schema validation successfully applied.");
			}
		} catch (MongoCommandException e) {
			log.error("Error applying schema validation: code={}, msg={}",
					e.getErrorCode(), e.getErrorMessage(), e);
			System.exit(1);
		}
	}

	private void testSchema(MongoDatabase db) {
		log.info("Testing schema");
		MongoCollection<Document> users = db.getCollection(COLLECTION_NAME);

		try {
			users.insertOne(new Document("name", "missingIsAdminField"));

		} catch (MongoWriteException e) {
		    log.error(e.getMessage());
		}
	}

	private SchemaMode parseMode(String raw) {
		String v = raw == null ? "" : raw.trim().toUpperCase();
		try {
			return SchemaMode.valueOf(v);
		} catch (IllegalArgumentException ex) {
			throw new IllegalArgumentException(
					"Invalid lab.schema-mode: " + raw + " (use apply, test, or both)");
		}
	}
}

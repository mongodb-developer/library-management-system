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
import java.util.Map;
import java.util.function.Consumer;

@Configuration
public class SchemaValidationConfig {

	private static final Logger log = LoggerFactory.getLogger(SchemaValidationConfig.class);
	private static final String USERS = "users";
	private static final String AUTHORS = "authors";
	private final Map<String, Consumer<MongoDatabase>> applyOps;
	private final Map<String, Consumer<MongoDatabase>> validateOps;
	enum SchemaMode { APPLY, TEST }

	public SchemaValidationConfig() {
		this.applyOps = Map.of(
				"users", this::applyUserSchema,
				"authors", this::applyAuthorSchema
		);
		this.validateOps = Map.of(
				"users", this::validateUserSchema,
				"authors", this::validateAuthorsSchema
		);
	}

	@Bean
	@ConditionalOnProperty(name = "lab.schema-mode")
	ApplicationRunner execute(
			MongoClient mongoClient,
			@Value("${spring.data.mongodb.database}") String databaseName,
			@Value("${lab.schema-mode}") String modeRaw,
			@Value("${lab.schema-target:users}") String targetRaw
	) {
		return args -> {
			SchemaMode mode = parseMode(modeRaw);
			String target = targetRaw == null ? "users" : targetRaw.trim().toLowerCase();
			MongoDatabase db = mongoClient.getDatabase(databaseName);

			switch (mode) {
				case APPLY -> applySchema(db, target);
				case TEST  -> validateSchema(db, target);
			}
		};
	}

	private void applySchema(MongoDatabase db, String target) {
		Consumer<MongoDatabase> op = applyOps.get(target);
		if (op == null) {
			log.warn("Apply schema: Unknown lab.schema-target='{}'. Use users|authors.", target);
			return;
		}
		op.accept(db);
	}

	private void validateSchema(MongoDatabase db, String target) {
		Consumer<MongoDatabase> op = validateOps.get(target);
		if (op == null) {
			log.warn("Validate schema: Unknown lab.schema-target='{}'. Use users|authors.", target);
			return;
		}
		op.accept(db);
	}

	private void applyUserSchema(MongoDatabase db) {
		ensureCollectionExists(db, USERS);
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
		runCollMod(db, USERS, userSchema);
		log.info("User collection schema validation successfully applied.");
	}

	private void validateUserSchema(MongoDatabase db) {
		MongoCollection<Document> users = db.getCollection(USERS);
		try {
			users.insertOne(new Document("name", "missingIsAdminField"));
			log.error("Expected validation failure on '{}', but insert succeeded.", USERS);
			System.exit(1);
		} catch (MongoWriteException e) {
			log.error(e.getMessage());
		}
	}

	private void applyAuthorSchema(MongoDatabase db) {
		// TODO: Implement the schema for authors ($jsonSchema with required 'name', 'bio', etc.)
	}

	private void validateAuthorsSchema(MongoDatabase db) {
		// TODO: Insert an invalid document to assert rejection (e.g., missing or short 'name')
	}

	private void runCollMod(MongoDatabase db, String collection, Document schema) {
		Document command = new Document("collMod", collection)
				.append("validator", schema)
				.append("validationLevel", "strict")
				.append("validationAction", "error");
		try {
			Document result = db.runCommand(command);
			Number ok = result.get("ok", Number.class);
			if (ok == null || ok.doubleValue() != 1.0) {
				failAndExit("Failed to enable schema validation on '" + collection + "'. Result: " + result.toJson(), null);
			}
		} catch (MongoCommandException e) {
			failAndExit("Error applying schema validation on '" + collection + "' (code="
					+ e.getErrorCode() + ", msg=" + e.getErrorMessage() + ")", e);
		}
	}

	private void ensureCollectionExists(MongoDatabase db, String name) {
		for (String n : db.listCollectionNames()) {
			if (n.equals(name)) return;
		}
		db.createCollection(name);
		log.info("Created collection '{}'.", name);
	}

	private void failAndExit(String message, Exception e) {
		if (e == null) {
			log.error("{}", message);
		} else {
			log.error("{}", message, e);
		}
		System.exit(1);
	}

	private SchemaMode parseMode(String raw) {
		String v = raw == null ? "" : raw.trim().toUpperCase();
		try {
			return SchemaMode.valueOf(v);
		} catch (IllegalArgumentException ex) {
			throw new IllegalArgumentException("Invalid lab.schema-mode: " + raw + " (use apply or test)");
		}
	}
}

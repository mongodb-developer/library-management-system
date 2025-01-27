package com.mongodb.devrel.library;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import com.mongodb.devrel.library.util.ErrorMessage;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class LibraryApplication {

	@Value("${MONGO_DATABASE}")
	private static Optional<String> database;

	public static void main(String[] args) {
		
		try {
			SpringApplication.run(LibraryApplication.class, args);
			log.info("App Started");
		} catch (org.springframework.beans.factory.UnsatisfiedDependencyException e) {
			if (database == null || !database.isPresent()) {
				log.error(ErrorMessage.noDB);
			}
		}

	}
}

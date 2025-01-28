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

	@Value("${DATABASE_URI}")
	private static Optional<String> mongoDBURI;

	public static void main(String[] args) {
		
		try {
			SpringApplication.run(LibraryApplication.class, args);
			log.info("App Started");
		} catch (org.springframework.beans.factory.UnsatisfiedDependencyException e) {
			if (mongoDBURI == null || !mongoDBURI.isPresent()) {
				log.error(ErrorMessage.noDB);
			}
		}

	}
}

package com.mongodb.devrel.library;

import com.mongodb.devrel.library.domain.util.ErrorMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class LibraryApplication implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(LibraryApplication.class);


	public static void main(String[] args) {
		
		try {
			SpringApplication.run(LibraryApplication.class, args);
		} catch (org.springframework.beans.factory.UnsatisfiedDependencyException e) {
			log.error(ErrorMessage.noDB);
		}
	}
	
	@Override
    public void run(String... args) {
		log.info("🚀 App Started");
	}
}


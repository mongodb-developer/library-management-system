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
		String envUri = System.getenv("MONGODB_URI");

		try {
			if (envUri == null || envUri.isBlank())
				throw new IllegalArgumentException("Missing MongoDB URI");

			SpringApplication.run(LibraryApplication.class, args);
		} catch (IllegalArgumentException e) {
			log.error(ErrorMessage.noDB);
			System.exit(1);
		}
	}
	
	@Override
    public void run(String... args) {
		log.info("🚀 App Started");
	}
}


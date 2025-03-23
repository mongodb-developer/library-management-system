package com.mongodb.devrel.library;

import com.mongodb.devrel.library.util.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
@Slf4j
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class LibraryApplication implements CommandLineRunner {

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


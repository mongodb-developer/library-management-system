package com.mongodb.devrel.library;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import com.mongodb.devrel.library.util.ErrorMessage;

import lombok.extern.slf4j.Slf4j;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.List;
import org.springframework.boot.CommandLineRunner;

@Slf4j
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class LibraryApplication implements CommandLineRunner {

	@Value("${spring.data.mongodb.uri}")
	private String mongoDBURI;

	@Value("${spring.data.mongodb.database}")
	private String database;

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


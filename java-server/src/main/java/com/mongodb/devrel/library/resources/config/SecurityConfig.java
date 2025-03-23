package com.mongodb.devrel.library.resources.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.mongodb.lang.NonNull;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @SuppressWarnings("null")
            @Override
            public void addCorsMappings(final @NonNull CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("*").allowedHeaders("*");
            }
        };
    }
    
}
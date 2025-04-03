package com.mongodb.devrel.library.domain.util;

import com.mongodb.devrel.library.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@Component
public class JWTConfig {

    @Value("${jwt.secret}")
    private String secret;

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String fromUser(User user) {
        // Replace with actual values
        String userId = user.get_id().toString();
        String userName = user.getName();
        boolean isAdmin = true; // Replace with user.isAdmin

        // Define issued at and expiration times
        long nowMillis = System.currentTimeMillis();
        Date issuedAt = new Date(nowMillis);
        Date expiration = new Date(nowMillis + (1000L * 60 * 60 * 24 * 365)); // 1 year

        // Create the claims (payload)
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("name", userName);
        claims.put("isAdmin", isAdmin);
        claims.put("iat", issuedAt.getTime() / 1000); // Unix timestamp

        SecretKey key = getSecretKey();
        // Generate the JWT
        String jwt = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        log.debug("Generated JWT: {}", jwt);
        return jwt;
    }

    public User toUser(String jwt) {
        User user = null;

        try {
            // Parse the JWT
            SecretKey key = getSecretKey();
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);

            // Extract the claims
            Claims claims = claimsJws.getBody();

            // Extract user details
            String userId = claims.get("sub", String.class);
            String userName = claims.get("name", String.class);
            Boolean isAdmin = claims.get("isAdmin", Boolean.class);
            // Long issuedAt = claims.get("iat", Long.class);

            // Print user details
            System.out.println("User ID: " + userId);
            System.out.println("User Name: " + userName);
            System.out.println("Is Admin: " + isAdmin);
            // System.out.println("Issued At: " + issuedAt);

            user = new User(new ObjectId(userId), userName, isAdmin);

        } catch (Exception e) {
            // Handle invalid JWTs
            log.error("Invalid JWT: ()", e.getMessage());
        }

        return user;
    }

    public User loggedInUserFromBearerAuthenticationHeader(String authorizationHeader) {
        String token = null;

        // Extract the token by removing "Bearer " prefix
        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        User user = toUser(token);

        log.debug("Token: " + token);
        log.debug("Name: " + user.getName());

        return user;
    }
}


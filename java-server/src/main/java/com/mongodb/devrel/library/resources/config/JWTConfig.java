package com.mongodb.devrel.library.resources.config;

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

            user = new User(
                    new ObjectId(claims.get("sub", String.class)),
                    claims.get("name", String.class),
                    claims.get("isAdmin", Boolean.class)
            );

        } catch (Exception e) {
            log.error("Invalid JWT: ()", e.getMessage());
        }

        return user;
    }

    public User loggedInUserFromBearerAuthenticationHeader(String authorizationHeader) {
        String token = null;

        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        User user = toUser(token);

        log.debug("Token: " + token);
        log.debug("Name: " + user.getName());

        return user;
    }
}


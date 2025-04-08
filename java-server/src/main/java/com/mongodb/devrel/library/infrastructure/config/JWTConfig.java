package com.mongodb.devrel.library.infrastructure.config;

import com.mongodb.devrel.library.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
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
        String userId = user.get_id().toString();
        String userName = user.getName();
        boolean isAdmin = true;

        long nowMillis = System.currentTimeMillis();
        Date issuedAt = new Date(nowMillis);
        Date expiration = new Date(nowMillis + (1000L * 60 * 60 * 24 * 365)); // 1 year

        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("name", userName);
        claims.put("isAdmin", isAdmin);
        claims.put("iat", issuedAt.getTime() / 1000); // Unix timestamp

        SecretKey key = getSecretKey();
        String jwt = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        log.debug("Generated JWT: {}", jwt);
        return jwt;
    }

    public Claims extractClaimsFromJwt(String jwt) {

        Claims claims = null;

        try {
            SecretKey key = getSecretKey();
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);

            claims = claimsJws.getBody();

        } catch (Exception e) {
            log.error("Invalid JWT: {}", e.getMessage());
        }

        return claims;
    }

}

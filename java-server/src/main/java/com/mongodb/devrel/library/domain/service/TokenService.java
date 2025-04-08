package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.util.LoggedInUser;
import com.mongodb.devrel.library.infrastructure.config.JWTConfig;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class TokenService {

    private final JWTConfig jwtConfig;
    private final UserService userService;

    TokenService(JWTConfig jwtConfig, UserService userService) {
        this.jwtConfig = jwtConfig;
        this.userService = userService;
    }

    public User extractUserFromHeader(String authorizationHeader) {
        String token = null;

        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        Claims claims = jwtConfig.extractClaimsFromJwt(token);

        User user = new User(
                new ObjectId(claims.get("sub", String.class)),
                claims.get("name", String.class),
                claims.get("isAdmin", Boolean.class)
        );

        log.debug("Token: {}", token);
        log.debug("Name: {}", user.getName());

        return user;
    }

    public String loginUser(Optional<String> username) {
        User user = userService.loginUser(username.orElse(""));
        log.info("User logged in: {}", user);
        LoggedInUser.user = user;
        return jwtConfig.fromUser(user);
    }


}

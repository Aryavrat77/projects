package com.R4.EMS.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtIssuer {

    private final JwtProperties properties;

    public String issue(UUID userId, String email, String role) {
        return JWT.create()
                .withSubject(userId.toString())
                .withClaim("email", email)
                .withArrayClaim("roles", new String[]{"ROLE_" + role})
                .withExpiresAt(Date.from(Instant.now().plus(Duration.of(1, ChronoUnit.DAYS)))) // Convert Instant to Date
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }
}

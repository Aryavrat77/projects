package com.R4.EMS.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import lombok.Builder;
import lombok.Getter;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtToPrincipalConverter {

    public UserPrincipal convert(DecodedJWT jwt) {
        // Safely extract roles
        List<String> roles = Optional.ofNullable(jwt.getClaim("roles").asList(String.class))
                .orElse(Collections.emptyList());  // Avoid null

        List<GrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toList());

        return UserPrincipal.builder()
                .userId(UUID.fromString(jwt.getSubject()))
                .email(jwt.getClaim("email").asString())
                .authorities(authorities)
                .build();
    }

    @Getter
    @Builder
    public static class UserPrincipal {
        private final UUID userId;
        private final String email;
        private final List<GrantedAuthority> authorities;
    }
}

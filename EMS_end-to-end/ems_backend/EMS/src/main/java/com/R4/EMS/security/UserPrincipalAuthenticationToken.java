package com.R4.EMS.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class UserPrincipalAuthenticationToken extends AbstractAuthenticationToken {

    private final JwtToPrincipalConverter.UserPrincipal principal;

    public UserPrincipalAuthenticationToken(JwtToPrincipalConverter.UserPrincipal principal) {
        super(principal.getAuthorities());
        this.principal = principal;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public JwtToPrincipalConverter.UserPrincipal getPrincipal() {
        return principal;
    }
}

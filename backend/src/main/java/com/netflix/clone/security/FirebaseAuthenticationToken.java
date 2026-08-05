package com.netflix.clone.security;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal;
    private final FirebaseToken token;

    public FirebaseAuthenticationToken(Object principal, FirebaseToken token, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.token = token;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    public FirebaseToken getToken() {
        return token;
    }

    public String getUid() {
        return token != null ? token.getUid() : (String) principal;
    }

    public String getEmail() {
        return token != null ? token.getEmail() : null;
    }
}

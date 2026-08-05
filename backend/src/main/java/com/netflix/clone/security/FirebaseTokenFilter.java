package com.netflix.clone.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                        decodedToken.getUid(),
                        decodedToken,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("Successfully authenticated Firebase user: {}", decodedToken.getUid());
            } catch (Exception e) {
                log.warn("Firebase token verification failed: {}. Checking for dev token...", e.getMessage());
                
                // Dev/Demo fallback token support
                if (token.startsWith("dev-user-") || token.equals("mock-token")) {
                    String devUid = token.startsWith("dev-user-") ? token.replace("dev-user-", "") : "demo-uid-123";
                    FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                            devUid,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("Authenticated in DEV fallback mode with UID: {}", devUid);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Invalid or expired Firebase JWT token\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}

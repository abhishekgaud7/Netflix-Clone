package com.netflix.clone.controller;

import com.netflix.clone.model.UserDocument;
import com.netflix.clone.security.FirebaseAuthenticationToken;
import com.netflix.clone.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDocument> getUserProfile(Authentication authentication) {
        String uid = extractUid(authentication);
        String email = authentication instanceof FirebaseAuthenticationToken ? 
                ((FirebaseAuthenticationToken) authentication).getEmail() : null;
        UserDocument user = userService.getOrCreateUser(uid, email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/profile/add")
    public ResponseEntity<UserDocument> addSubProfile(Authentication authentication, @RequestBody Map<String, String> body) {
        String uid = extractUid(authentication);
        String name = body.get("name");
        String avatarUrl = body.get("avatarUrl");
        UserDocument user = userService.addProfile(uid, name, avatarUrl);
        return ResponseEntity.ok(user);
    }

    private String extractUid(Authentication authentication) {
        if (authentication instanceof FirebaseAuthenticationToken token) {
            return token.getUid();
        }
        return authentication.getName();
    }
}

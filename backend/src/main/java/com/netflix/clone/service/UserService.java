package com.netflix.clone.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.netflix.clone.model.UserDocument;
import com.netflix.clone.model.UserProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired(required = false)
    @Nullable
    private Firestore firestore;

    // Fallback in-memory map for dev testing when Firestore is not live
    private final Map<String, UserDocument> devUserStore = new ConcurrentHashMap<>();

    public UserDocument getOrCreateUser(String uid, String email) {
        if (firestore != null) {
            try {
                DocumentReference docRef = firestore.collection("users").document(uid);
                ApiFuture<DocumentSnapshot> future = docRef.get();
                DocumentSnapshot document = future.get();

                if (document.exists()) {
                    UserDocument user = document.toObject(UserDocument.class);
                    if (user != null) return user;
                }

                // Create default user profile
                List<UserProfile> defaultProfiles = List.of(
                        UserProfile.builder().id("1").name("Default Profile").avatarUrl("https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png").build()
                );
                UserDocument newUser = UserDocument.builder()
                        .uid(uid)
                        .email(email != null ? email : "user@netflix-clone.com")
                        .createdAt(Instant.now().toString())
                        .profiles(defaultProfiles)
                        .build();

                docRef.set(newUser).get();
                log.info("Created new user document in Firestore for UID: {}", uid);
                return newUser;
            } catch (Exception e) {
                log.error("Firestore user fetch failed: {}. Utilizing dev user fallback.", e.getMessage());
            }
        }

        return devUserStore.computeIfAbsent(uid, id -> {
            List<UserProfile> defaultProfiles = List.of(
                    UserProfile.builder().id("1").name("Default Profile").avatarUrl("https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png").build()
            );
            return UserDocument.builder()
                    .uid(id)
                    .email(email != null ? email : id + "@netflix-clone.com")
                    .createdAt(Instant.now().toString())
                    .profiles(new ArrayList<>(defaultProfiles))
                    .build();
        });
    }

    public UserDocument addProfile(String uid, String profileName, String avatarUrl) {
        UserDocument user = getOrCreateUser(uid, null);
        UserProfile newProfile = UserProfile.builder()
                .id(UUID.randomUUID().toString())
                .name(profileName)
                .avatarUrl(avatarUrl != null ? avatarUrl : "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png")
                .build();

        user.getProfiles().add(newProfile);

        if (firestore != null) {
            try {
                firestore.collection("users").document(uid).set(user).get();
            } catch (Exception e) {
                log.error("Firestore profile update failed: {}", e.getMessage());
            }
        }
        return user;
    }
}

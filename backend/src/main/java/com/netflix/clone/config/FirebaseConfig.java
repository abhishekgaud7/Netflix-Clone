package com.netflix.clone.config;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.lang.Nullable;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.config-path:serviceAccountKey.json}")
    private String configPath;

    @Bean
    public FirebaseApp firebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        try {
            ClassPathResource resource = new ClassPathResource(configPath);
            if (resource.exists()) {
                try (InputStream serviceAccount = resource.getInputStream()) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(com.google.auth.oauth2.GoogleCredentials.fromStream(serviceAccount))
                            .setProjectId("netflix-clone-demo")
                            .build();
                    FirebaseApp app = FirebaseApp.initializeApp(options);
                    log.info("🔥 Firebase Admin SDK initialized successfully: {}", app.getName());
                    return app;
                }
            }
        } catch (Exception e) {
            log.warn("⚠️ Firebase serviceAccountKey parsing notice: {}. Running Spring Boot in Dev Fallback Mode.", e.getMessage());
        }

        // Initialize dev fallback app
        try {
            FirebaseOptions devOptions = FirebaseOptions.builder()
                    .setCredentials(new com.google.auth.oauth2.GoogleCredentials() {})
                    .setProjectId("netflix-clone-demo")
                    .build();
            FirebaseApp devApp = FirebaseApp.initializeApp(devOptions, "dev-fallback-app");
            log.info("🛠 Dev Fallback FirebaseApp initialized successfully: {}", devApp.getName());
            return devApp;
        } catch (Exception ex) {
            log.warn("Dev fallback FirebaseApp notice: {}", ex.getMessage());
            if (!FirebaseApp.getApps().isEmpty()) {
                return FirebaseApp.getApps().get(0);
            }
            return null;
        }
    }

    @Bean
    public Firestore firestore(@Nullable FirebaseApp firebaseApp) {
        if (firebaseApp == null || "dev-fallback-app".equals(firebaseApp.getName())) {
            log.warn("Firestore client disabled (dev fallback mode active). Services will use in-memory store.");
            return null;
        }
        try {
            return FirestoreClient.getFirestore(firebaseApp);
        } catch (Exception e) {
            log.warn("Firestore client initialization notice: {}. Using in-memory store fallback.", e.getMessage());
            return null;
        }
    }
}

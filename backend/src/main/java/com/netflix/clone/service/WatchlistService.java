package com.netflix.clone.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.netflix.clone.model.WatchlistDocument;
import com.netflix.clone.model.WatchlistItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WatchlistService {

    private static final Logger log = LoggerFactory.getLogger(WatchlistService.class);

    @Autowired(required = false)
    @Nullable
    private Firestore firestore;

    // Fallback store for dev/testing when Firestore connection is unavailable
    private final Map<String, WatchlistDocument> devWatchlistStore = new ConcurrentHashMap<>();

    public WatchlistDocument getWatchlist(String uid) {
        if (firestore != null) {
            try {
                DocumentReference docRef = firestore.collection("watchlists").document(uid);
                ApiFuture<DocumentSnapshot> future = docRef.get();
                DocumentSnapshot document = future.get();

                if (document.exists()) {
                    WatchlistDocument doc = document.toObject(WatchlistDocument.class);
                    if (doc != null) return doc;
                }
            } catch (Exception e) {
                log.error("Firestore getWatchlist failed: {}. Utilizing dev store fallback.", e.getMessage());
            }
        }

        return devWatchlistStore.computeIfAbsent(uid, id -> WatchlistDocument.builder()
                .uid(id)
                .movies(new ArrayList<>())
                .build());
    }

    public WatchlistDocument addToWatchlist(String uid, WatchlistItem item) {
        WatchlistDocument watchlist = getWatchlist(uid);

        if (item.getAddedAt() == null) {
            item.setAddedAt(Instant.now().toString());
        }

        // Prevent duplicates
        watchlist.getMovies().removeIf(m -> m.getMovieId().equals(item.getMovieId()));
        watchlist.getMovies().add(0, item);

        if (firestore != null) {
            try {
                firestore.collection("watchlists").document(uid).set(watchlist).get();
                log.info("Added movie {} to watchlist in Firestore for user {}", item.getMovieId(), uid);
            } catch (Exception e) {
                log.error("Firestore addToWatchlist failed: {}", e.getMessage());
            }
        }
        return watchlist;
    }

    public WatchlistDocument removeFromWatchlist(String uid, String movieId) {
        WatchlistDocument watchlist = getWatchlist(uid);
        boolean removed = watchlist.getMovies().removeIf(m -> m.getMovieId().equals(movieId));

        if (removed && firestore != null) {
            try {
                firestore.collection("watchlists").document(uid).set(watchlist).get();
                log.info("Removed movie {} from watchlist in Firestore for user {}", movieId, uid);
            } catch (Exception e) {
                log.error("Firestore removeFromWatchlist failed: {}", e.getMessage());
            }
        }
        return watchlist;
    }
}

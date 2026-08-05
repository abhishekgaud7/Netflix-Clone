package com.netflix.clone.controller;

import com.netflix.clone.model.WatchlistDocument;
import com.netflix.clone.model.WatchlistItem;
import com.netflix.clone.security.FirebaseAuthenticationToken;
import com.netflix.clone.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<WatchlistDocument> getWatchlistByUserId(@PathVariable String userId) {
        WatchlistDocument watchlist = watchlistService.getWatchlist(userId);
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping
    public ResponseEntity<WatchlistDocument> getMyWatchlist(Authentication authentication) {
        String uid = extractUid(authentication);
        WatchlistDocument watchlist = watchlistService.getWatchlist(uid);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/add")
    public ResponseEntity<WatchlistDocument> addToWatchlist(Authentication authentication, @RequestBody WatchlistItem item) {
        String uid = extractUid(authentication);
        WatchlistDocument updated = watchlistService.addToWatchlist(uid, item);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/remove")
    public ResponseEntity<WatchlistDocument> removeFromWatchlist(Authentication authentication, @RequestBody Map<String, String> body) {
        String uid = extractUid(authentication);
        String movieId = body.get("movieId");
        WatchlistDocument updated = watchlistService.removeFromWatchlist(uid, movieId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<WatchlistDocument> deleteFromWatchlist(Authentication authentication, @PathVariable String movieId) {
        String uid = extractUid(authentication);
        WatchlistDocument updated = watchlistService.removeFromWatchlist(uid, movieId);
        return ResponseEntity.ok(updated);
    }

    private String extractUid(Authentication authentication) {
        if (authentication instanceof FirebaseAuthenticationToken token) {
            return token.getUid();
        }
        return authentication != null ? authentication.getName() : "demo-uid-123";
    }
}

package com.netflix.clone.controller;

import com.netflix.clone.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getCategory(@PathVariable String category) {
        String categoryPath = switch (category.toLowerCase()) {
            case "trending" -> "trending/all/week";
            case "top-rated" -> "movie/top_rated";
            case "action" -> "discover/movie?with_genres=28";
            case "comedy" -> "discover/movie?with_genres=35";
            case "horror" -> "discover/movie?with_genres=27";
            case "documentaries" -> "discover/movie?with_genres=99";
            default -> "trending/movie/day";
        };
        Map<String, Object> data = movieService.fetchCategory(categoryPath);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam("query") String query) {
        Map<String, Object> data = movieService.searchMovies(query);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMovieDetails(
            @PathVariable String id,
            @RequestParam(value = "type", required = false, defaultValue = "movie") String mediaType) {
        Map<String, Object> details = movieService.fetchMovieDetails(mediaType, id);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Netflix Clone Java Spring Boot Backend"));
    }
}

package com.netflix.clone.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class MovieService {

    private static final Logger log = LoggerFactory.getLogger(MovieService.class);

    @Value("${tmdb.api-key:4e44d9029b1270a757cddc766a1bcb63}")
    private String apiKey;

    @Value("${tmdb.base-url:https://api.themoviedb.org/3}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> fetchCategory(String categoryPath) {
        try {
            String url = String.format("%s/%s?api_key=%s&language=en-US&page=1", baseUrl, categoryPath, apiKey);
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Failed to fetch category {}: {}", categoryPath, e.getMessage());
            return Collections.singletonMap("results", Collections.emptyList());
        }
    }

    public Map<String, Object> searchMovies(String query) {
        try {
            String url = String.format("%s/search/multi?api_key=%s&language=en-US&query=%s&page=1", baseUrl, apiKey, query);
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Failed to search movies for query {}: {}", query, e.getMessage());
            return Collections.singletonMap("results", Collections.emptyList());
        }
    }

    public Map<String, Object> fetchMovieDetails(String mediaType, String id) {
        try {
            String url = String.format("%s/%s/%s?api_key=%s&language=en-US&append_to_response=videos,credits,similar", 
                    baseUrl, mediaType != null ? mediaType : "movie", id, apiKey);
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Failed to fetch details for {} {}: {}", mediaType, id, e.getMessage());
            return Collections.emptyMap();
        }
    }
}

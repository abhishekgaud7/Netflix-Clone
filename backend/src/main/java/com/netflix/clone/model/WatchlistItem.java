package com.netflix.clone.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistItem {
    private String movieId;
    private String title;
    private String posterPath;
    private String mediaType;
    private String addedAt;
    private String overview;
    private Double voteAverage;
    private String backdropPath;
}

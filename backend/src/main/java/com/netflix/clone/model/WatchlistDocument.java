package com.netflix.clone.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistDocument {
    private String uid;
    @Builder.Default
    private List<WatchlistItem> movies = new ArrayList<>();
}

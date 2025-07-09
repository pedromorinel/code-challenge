package com.code.challenge.omdb.integration.bffomdb.client;

import com.code.challenge.omdb.integration.bffomdb.dto.MovieDetails;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchResponse;
import com.code.challenge.omdb.integration.bffomdb.exception.OmdbApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class OmdbApiClient {
    
    private final WebClient omdbWebClient;
    
    @Value("${omdb.api.key}")
    private String apiKey;
    
    @Value("${omdb.api.timeout}")
    private Duration apiTimeout;

    public Mono<MovieSearchResponse> searchMovies(String title, Integer page, String type, Integer year) {
        return omdbWebClient
                .get()
                .uri(uriBuilder -> {
                    uriBuilder
                            .queryParam("apikey", apiKey)
                            .queryParam("s", title)
                            .queryParam("page", page != null ? page : 1);
                    
                    if (type != null && !type.isEmpty()) {
                        uriBuilder.queryParam("type", type);
                    }
                    
                    if (year != null) {
                        uriBuilder.queryParam("y", year);
                    }
                    
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(MovieSearchResponse.class)
                .timeout(apiTimeout)
                .doOnSuccess(response -> {
                    if (response != null && !response.isSuccess()) {
                        log.warn("OMDB API returned error: {}", response.getError());
                    }
                })
                .onErrorMap(Exception.class, ex -> {
                    log.error("Error calling OMDB search API: {}", ex.getMessage(), ex);
                    return new OmdbApiException("Failed to search movies: " + ex.getMessage(), ex);
                });
    }

    public Mono<MovieDetails> getMovieDetails(String imdbId) {
        if (imdbId == null || imdbId.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("IMDB ID cannot be null or empty"));
        }
        
        return omdbWebClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("apikey", apiKey)
                        .queryParam("i", imdbId)
                        .queryParam("plot", "full")
                        .build())
                .retrieve()
                .bodyToMono(MovieDetails.class)
                .timeout(apiTimeout)
                .doOnSuccess(response -> {
                    if (response != null && !response.isSuccess()) {
                        log.warn("OMDB API returned error for IMDB ID {}: {}", imdbId, response.getError());
                    }
                })
                .onErrorMap(Exception.class, ex -> {
                    log.error("Error getting movie details for IMDB ID {}: {}", imdbId, ex.getMessage(), ex);
                    return new OmdbApiException("Failed to get movie details: " + ex.getMessage(), ex);
                });
    }

    public Mono<MovieDetails> getMovieByTitle(String title, Integer year) {
        if (title == null || title.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Title cannot be null or empty"));
        }
        
        return omdbWebClient
                .get()
                .uri(uriBuilder -> {
                    uriBuilder
                            .queryParam("apikey", apiKey)
                            .queryParam("t", title)
                            .queryParam("plot", "full");
                    
                    if (year != null) {
                        uriBuilder.queryParam("y", year);
                    }
                    
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(MovieDetails.class)
                .timeout(apiTimeout)
                .doOnSuccess(response -> {
                    if (response != null && !response.isSuccess()) {
                        log.warn("OMDB API returned error for title '{}': {}", title, response.getError());
                    }
                })
                .onErrorMap(Exception.class, ex -> {
                    log.error("Error getting movie by title '{}': {}", title, ex.getMessage(), ex);
                    return new OmdbApiException("Failed to get movie by title: " + ex.getMessage(), ex);
                });
    }
} 
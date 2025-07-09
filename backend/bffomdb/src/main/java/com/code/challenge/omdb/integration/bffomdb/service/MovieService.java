package com.code.challenge.omdb.integration.bffomdb.service;

import com.code.challenge.omdb.integration.bffomdb.client.OmdbApiClient;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieDetails;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchRequest;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchResponse;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSummary;
import com.code.challenge.omdb.integration.bffomdb.exception.OmdbApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieService {
    
    private final OmdbApiClient omdbApiClient;

    @Cacheable(value = "movieSearch", key = "#request.query + '_' + #request.page + '_' + #request.type + '_' + #request.year")
    public Mono<MovieSearchResponse> searchMovies(MovieSearchRequest request) {
        log.info("Searching movies with query: '{}', page: {}, type: {}, year: {} (cache miss)", 
                request.getQuery(), request.getPage(), request.getType(), request.getYear());
        
        return omdbApiClient.searchMovies(
                request.getQuery(),
                request.getPage(),
                request.getTypeOrDefault(),
                request.getYear()
        )
        .map(this::processSearchResponse)
        .doOnSuccess(response -> {
            if (response.isSuccess()) {
                log.info("Found {} movies for query '{}' (cached for 15 minutes)", 
                        response.getTotalResultsAsInt(), request.getQuery());
            } else {
                log.warn("No movies found for query '{}': {}", request.getQuery(), response.getError());
            }
        });
    }

    @Cacheable(value = "movieDetails", key = "#imdbId")
    public Mono<MovieDetails> getMovieDetails(String imdbId) {
        log.info("Getting movie details for IMDB ID: {} (cache miss)", imdbId);
        
        return omdbApiClient.getMovieDetails(imdbId)
                .map(this::processMovieDetails)
                .doOnSuccess(details -> {
                    if (details.isSuccess()) {
                        log.info("Retrieved details for movie: {} ({}) (cached for 1 hour)", details.getTitle(), details.getYear());
                    } else {
                        log.warn("Failed to get movie details for IMDB ID {}: {}", imdbId, details.getError());
                    }
                });
    }

    @Cacheable(value = "movieDetails", key = "#title + '_' + #year")
    public Mono<MovieDetails> getMovieByTitle(String title, Integer year) {
        log.info("Getting movie by title: '{}', year: {} (cache miss)", title, year);
        
        return omdbApiClient.getMovieByTitle(title, year)
                .map(this::processMovieDetails)
                .doOnSuccess(details -> {
                    if (details.isSuccess()) {
                        log.info("Retrieved movie: {} ({}) (cached for 1 hour)", details.getTitle(), details.getYear());
                    } else {
                        log.warn("Failed to get movie by title '{}': {}", title, details.getError());
                    }
                });
    }

    @Cacheable(value = "popularMovies", key = "'popular'")
    public Mono<List<MovieSummary>> getPopularMovies() {
        log.info("Getting popular movies (cache miss)");

        return omdbApiClient.searchMovies("Batman", 1, "movie", null)
                .map(response -> {
                    if (response.isSuccess() && response.getSearch() != null) {
                        return response.getSearch().stream()
                                .limit(10)
                                .collect(Collectors.toList());
                    }
                    return Collections.<MovieSummary>emptyList();
                })
                .doOnSuccess(movies -> log.info("Retrieved {} popular movies (cached for 30 minutes)", movies.size()))
                .onErrorReturn(Collections.<MovieSummary>emptyList());
    }
    

    public Mono<MovieDetails> validateMovieDetails(String imdbId) {
        return getMovieDetails(imdbId)
                .filter(MovieDetails::isSuccess)
                .switchIfEmpty(Mono.error(new OmdbApiException("Movie not found or invalid IMDB ID: " + imdbId)));
    }

    private MovieSearchResponse processSearchResponse(MovieSearchResponse response) {
        if (response == null) {
            throw new OmdbApiException("Null response from OMDB API");
        }
        
        if (!response.isSuccess()) {
            log.warn("OMDB API error: {}", response.getError());
        }
        if (response.getSearch() == null) {
            response.setSearch(Collections.<MovieSummary>emptyList());
        }
        
        return response;
    }

    private MovieDetails processMovieDetails(MovieDetails details) {
        if (details == null) {
            throw new OmdbApiException("Null response from OMDB API");
        }
        
        if (!details.isSuccess()) {
            log.warn("OMDB API error: {}", details.getError());
        }
        
        return details;
    }

    public Mono<MovieSearchResponse> searchMoviesWithFallback(MovieSearchRequest request) {
        return searchMovies(request)
                .onErrorResume(throwable -> {
                    log.error("Primary search failed, attempting fallback", throwable);
                    MovieSearchResponse fallbackResponse = new MovieSearchResponse();
                    fallbackResponse.setResponse("False");
                    fallbackResponse.setError("Service temporarily unavailable. Please try again later.");
                    fallbackResponse.setSearch(Collections.<MovieSummary>emptyList());
                    fallbackResponse.setTotalResults("0");
                    return Mono.just(fallbackResponse);
                });
    }
} 
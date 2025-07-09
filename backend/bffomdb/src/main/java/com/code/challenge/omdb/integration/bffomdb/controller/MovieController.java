package com.code.challenge.omdb.integration.bffomdb.controller;

import com.code.challenge.omdb.integration.bffomdb.dto.MovieDetails;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchRequest;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchResponse;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSummary;
import com.code.challenge.omdb.integration.bffomdb.service.MovieService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:4200", "http://frontend:3000", "http://127.0.0.1:3000"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowCredentials = "true")
public class MovieController {
    
    private final MovieService movieService;
    
    @PostMapping("/search")
    public Mono<ResponseEntity<MovieSearchResponse>> searchMovies(@Valid @RequestBody MovieSearchRequest request) {
        log.info("Received search request: {}", request);
        
        return movieService.searchMoviesWithFallback(request)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Search request completed successfully"))
                .doOnError(error -> log.error("Search request failed", error));
    }
    
    @GetMapping("/{imdbId}")
    public Mono<ResponseEntity<MovieDetails>> getMovieDetails(@PathVariable @NotBlank String imdbId) {
        log.info("Received request for movie details: {}", imdbId);
        
        return movieService.getMovieDetails(imdbId)
                .map(details -> {
                    if (details.isSuccess()) {
                        return ResponseEntity.ok(details);
                    } else {
                        return ResponseEntity.notFound().<MovieDetails>build();
                    }
                })
                .doOnSuccess(response -> log.info("Movie details request completed: {}", imdbId))
                .doOnError(error -> log.error("Movie details request failed for: {}", imdbId, error));
    }
    
    @GetMapping("/title/{title}")
    public Mono<ResponseEntity<MovieDetails>> getMovieByTitle(
            @PathVariable @NotBlank String title,
            @RequestParam(required = false) Integer year) {
        
        log.info("Received request for movie by title: '{}', year: {}", title, year);
        
        return movieService.getMovieByTitle(title, year)
                .map(details -> {
                    if (details.isSuccess()) {
                        return ResponseEntity.ok(details);
                    } else {
                        return ResponseEntity.notFound().<MovieDetails>build();
                    }
                })
                .doOnSuccess(response -> log.info("Movie by title request completed: '{}'", title))
                .doOnError(error -> log.error("Movie by title request failed for: '{}'", title, error));
    }
    
    @GetMapping("/popular")
    public Mono<ResponseEntity<List<MovieSummary>>> getPopularMovies() {
        log.info("Received request for popular movies");
        
        return movieService.getPopularMovies()
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Popular movies request completed"))
                .doOnError(error -> log.error("Popular movies request failed", error));
    }
    
    @GetMapping("/search")
    public Mono<ResponseEntity<MovieSearchResponse>> searchMoviesSimple(
            @RequestParam @NotBlank String q,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer year) {
        
        log.info("Received simple search request: q='{}', page={}, type={}, year={}", q, page, type, year);
        
        MovieSearchRequest request = new MovieSearchRequest();
        request.setQuery(q);
        request.setPage(page);
        request.setType(type);
        request.setYear(year);
        
        return movieService.searchMoviesWithFallback(request)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("Simple search request completed"))
                .doOnError(error -> log.error("Simple search request failed", error));
    }
    
    @GetMapping("/health")
    public Mono<ResponseEntity<String>> healthCheck() {
        log.debug("Health check requested");

        return Mono.just(ResponseEntity.ok("Movie service is healthy"))
                .doOnSuccess(response -> log.debug("Health check completed"));
    }
} 
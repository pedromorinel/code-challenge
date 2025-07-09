package com.code.challenge.omdb.integration.bffomdb.service;

import com.code.challenge.omdb.integration.bffomdb.client.OmdbApiClient;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieDetails;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchRequest;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSearchResponse;
import com.code.challenge.omdb.integration.bffomdb.dto.MovieSummary;
import com.code.challenge.omdb.integration.bffomdb.exception.OmdbApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("MovieService Tests")
class MovieServiceTest {
    
    @Mock
    private OmdbApiClient omdbApiClient;
    
    @InjectMocks
    private MovieService movieService;
    
    private MovieSearchRequest searchRequest;
    private MovieSearchResponse searchResponse;
    private MovieDetails movieDetails;
    
    @BeforeEach
    void setUp() {
        searchRequest = new MovieSearchRequest();
        searchRequest.setQuery("Batman");
        searchRequest.setPage(1);
        searchRequest.setType("movie");
        
        searchResponse = new MovieSearchResponse();
        searchResponse.setResponse("True");
        searchResponse.setTotalResults("10");
        
        MovieSummary movieSummary = new MovieSummary();
        movieSummary.setTitle("Batman Begins");
        movieSummary.setYear("2005");
        movieSummary.setImdbId("tt0372784");
        movieSummary.setType("movie");
        movieSummary.setPoster("https://example.com/poster.jpg");
        
        searchResponse.setSearch(List.of(movieSummary));
        
        movieDetails = new MovieDetails();
        movieDetails.setTitle("Batman Begins");
        movieDetails.setYear("2005");
        movieDetails.setImdbId("tt0372784");
        movieDetails.setResponse("True");
        movieDetails.setPlot("After training with his mentor, Batman begins his fight to free crime-ridden Gotham City.");
    }
    
    @Test
    @DisplayName("Should search movies successfully")
    void shouldSearchMoviesSuccessfully() {

        when(omdbApiClient.searchMovies(anyString(), anyInt(), anyString(), any()))
                .thenReturn(Mono.just(searchResponse));

        StepVerifier.create(movieService.searchMovies(searchRequest))
                .expectNextMatches(response -> 
                        response.isSuccess() && 
                        response.getSearch().size() == 1 &&
                        "Batman Begins".equals(response.getSearch().get(0).getTitle()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should handle search with no results")
    void shouldHandleSearchWithNoResults() {

        MovieSearchResponse noResultsResponse = new MovieSearchResponse();
        noResultsResponse.setResponse("False");
        noResultsResponse.setError("Movie not found!");
        noResultsResponse.setSearch(null);
        
        when(omdbApiClient.searchMovies(anyString(), anyInt(), anyString(), any()))
                .thenReturn(Mono.just(noResultsResponse));

        StepVerifier.create(movieService.searchMovies(searchRequest))
                .expectNextMatches(response -> 
                        !response.isSuccess() && 
                        response.getSearch().isEmpty() &&
                        "Movie not found!".equals(response.getError()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should get movie details successfully")
    void shouldGetMovieDetailsSuccessfully() {

        String imdbId = "tt0372784";
        when(omdbApiClient.getMovieDetails(imdbId))
                .thenReturn(Mono.just(movieDetails));

        StepVerifier.create(movieService.getMovieDetails(imdbId))
                .expectNextMatches(details -> 
                        details.isSuccess() && 
                        "Batman Begins".equals(details.getTitle()) &&
                        "2005".equals(details.getYear()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should handle movie not found")
    void shouldHandleMovieNotFound() {

        String imdbId = "tt0000000";
        MovieDetails notFoundDetails = new MovieDetails();
        notFoundDetails.setResponse("False");
        notFoundDetails.setError("Incorrect IMDb ID.");
        
        when(omdbApiClient.getMovieDetails(imdbId))
                .thenReturn(Mono.just(notFoundDetails));

        StepVerifier.create(movieService.getMovieDetails(imdbId))
                .expectNextMatches(details -> 
                        !details.isSuccess() && 
                        "Incorrect IMDb ID.".equals(details.getError()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should get movie by title successfully")
    void shouldGetMovieByTitleSuccessfully() {

        String title = "Batman Begins";
        Integer year = 2005;
        when(omdbApiClient.getMovieByTitle(title, year))
                .thenReturn(Mono.just(movieDetails));

        StepVerifier.create(movieService.getMovieByTitle(title, year))
                .expectNextMatches(details -> 
                        details.isSuccess() && 
                        title.equals(details.getTitle()) &&
                        year.toString().equals(details.getYear()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should handle API exception")
    void shouldHandleApiException() {

        when(omdbApiClient.searchMovies(anyString(), anyInt(), anyString(), any()))
                .thenReturn(Mono.error(new OmdbApiException("API Error")));

        StepVerifier.create(movieService.searchMovies(searchRequest))
                .expectError(OmdbApiException.class)
                .verify();
    }
    
    @Test
    @DisplayName("Should search movies with fallback on error")
    void shouldSearchMoviesWithFallbackOnError() {

        when(omdbApiClient.searchMovies(anyString(), anyInt(), anyString(), any()))
                .thenReturn(Mono.error(new RuntimeException("Network error")));

        StepVerifier.create(movieService.searchMoviesWithFallback(searchRequest))
                .expectNextMatches(response -> 
                        !response.isSuccess() && 
                        response.getError().contains("Service temporarily unavailable") &&
                        response.getSearch().isEmpty())
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should get popular movies")
    void shouldGetPopularMovies() {

        when(omdbApiClient.searchMovies(eq("Batman"), eq(1), eq("movie"), isNull()))
                .thenReturn(Mono.just(searchResponse));

        StepVerifier.create(movieService.getPopularMovies())
                .expectNextMatches(movies -> 
                        movies.size() == 1 && 
                        "Batman Begins".equals(movies.get(0).getTitle()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should return empty list when popular movies search fails")
    void shouldReturnEmptyListWhenPopularMoviesSearchFails() {

        when(omdbApiClient.searchMovies(eq("Batman"), eq(1), eq("movie"), isNull()))
                .thenReturn(Mono.error(new RuntimeException("API Error")));

        StepVerifier.create(movieService.getPopularMovies())
                .expectNext(Collections.<MovieSummary>emptyList())
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should validate movie details successfully")
    void shouldValidateMovieDetailsSuccessfully() {

        String imdbId = "tt0372784";
        when(omdbApiClient.getMovieDetails(imdbId))
                .thenReturn(Mono.just(movieDetails));

        StepVerifier.create(movieService.validateMovieDetails(imdbId))
                .expectNextMatches(details -> 
                        details.isSuccess() && 
                        "Batman Begins".equals(details.getTitle()))
                .verifyComplete();
    }
    
    @Test
    @DisplayName("Should fail validation for invalid movie")
    void shouldFailValidationForInvalidMovie() {

        String imdbId = "tt0000000";
        MovieDetails invalidDetails = new MovieDetails();
        invalidDetails.setResponse("False");
        invalidDetails.setError("Incorrect IMDb ID.");
        
        when(omdbApiClient.getMovieDetails(imdbId))
                .thenReturn(Mono.just(invalidDetails));

        StepVerifier.create(movieService.validateMovieDetails(imdbId))
                .expectError(OmdbApiException.class)
                .verify();
    }
} 
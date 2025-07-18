package com.code.challenge.omdb.integration.bffomdb.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieDetails {
    
    @JsonProperty("Title")
    private String title;
    
    @JsonProperty("Year")
    private String year;
    
    @JsonProperty("Rated")
    private String rated;
    
    @JsonProperty("Released")
    private String released;
    
    @JsonProperty("Runtime")
    private String runtime;
    
    @JsonProperty("Genre")
    private String genre;
    
    @JsonProperty("Director")
    private String director;
    
    @JsonProperty("Writer")
    private String writer;
    
    @JsonProperty("Actors")
    private String actors;
    
    @JsonProperty("Plot")
    private String plot;
    
    @JsonProperty("Language")
    private String language;
    
    @JsonProperty("Country")
    private String country;
    
    @JsonProperty("Awards")
    private String awards;
    
    @JsonProperty("Poster")
    private String poster;
    
    @JsonProperty("Ratings")
    private List<Rating> ratings;
    
    @JsonProperty("Metascore")
    private String metascore;
    
    @JsonProperty("imdbRating")
    private String imdbRating;
    
    @JsonProperty("imdbVotes")
    private String imdbVotes;
    
    @JsonProperty("imdbID")
    private String imdbId;
    
    @JsonProperty("Type")
    private String type;
    
    @JsonProperty("DVD")
    private String dvd;
    
    @JsonProperty("BoxOffice")
    private String boxOffice;
    
    @JsonProperty("Production")
    private String production;
    
    @JsonProperty("Website")
    private String website;
    
    @JsonProperty("Response")
    private String response;
    
    @JsonProperty("Error")
    private String error;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rating {
        @JsonProperty("Source")
        private String source;
        
        @JsonProperty("Value")
        private String value;
    }
    
    public boolean isSuccess() {
        return "True".equals(response);
    }
    
    public boolean hasPoster() {
        return poster != null && !"N/A".equals(poster);
    }
    
    public Double getImdbRatingAsDouble() {
        try {
            return Double.parseDouble(imdbRating);
        } catch (NumberFormatException e) {
            return null;
        }
    }
} 
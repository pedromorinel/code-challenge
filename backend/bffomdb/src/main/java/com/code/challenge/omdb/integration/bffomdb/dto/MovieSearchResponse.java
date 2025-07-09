package com.code.challenge.omdb.integration.bffomdb.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieSearchResponse {
    
    @JsonProperty("Search")
    private List<MovieSummary> search;
    
    @JsonProperty("totalResults")
    private String totalResults;
    
    @JsonProperty("Response")
    private String response;
    
    @JsonProperty("Error")
    private String error;
    
    public boolean isSuccess() {
        return "True".equals(response);
    }
    
    public int getTotalResultsAsInt() {
        try {
            return Integer.parseInt(totalResults);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
} 
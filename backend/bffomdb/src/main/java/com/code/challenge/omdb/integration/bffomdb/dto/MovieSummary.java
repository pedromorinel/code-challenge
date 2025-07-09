package com.code.challenge.omdb.integration.bffomdb.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieSummary {
    
    @JsonProperty("Title")
    private String title;
    
    @JsonProperty("Year")
    private String year;
    
    @JsonProperty("imdbID")
    private String imdbId;
    
    @JsonProperty("Type")
    private String type;
    
    @JsonProperty("Poster")
    private String poster;
}
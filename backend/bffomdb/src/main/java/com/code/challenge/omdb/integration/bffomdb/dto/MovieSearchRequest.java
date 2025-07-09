package com.code.challenge.omdb.integration.bffomdb.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MovieSearchRequest {
    
    @NotBlank(message = "Search query cannot be empty")
    @Size(min = 1, max = 100, message = "Search query must be between 1 and 100 characters")
    private String query;
    
    @Min(value = 1, message = "Page must be greater than 0")
    private Integer page = 1;
    
    private String type;
    
    private Integer year;
    
    public String getTypeOrDefault() {
        return type != null ? type : "movie";
    }
} 
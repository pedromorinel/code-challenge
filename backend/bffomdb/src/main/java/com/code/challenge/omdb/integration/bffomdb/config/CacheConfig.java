package com.code.challenge.omdb.integration.bffomdb.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {

        SimpleCacheManager cacheManager = new SimpleCacheManager();

        ConcurrentMapCache movieDetailsCache = new ConcurrentMapCache("movieDetails");
        ConcurrentMapCache movieSearchCache = new ConcurrentMapCache("movieSearch");
        ConcurrentMapCache popularMoviesCache = new ConcurrentMapCache("popularMovies");
        
        cacheManager.setCaches(Arrays.asList(
            movieDetailsCache,
            movieSearchCache, 
            popularMoviesCache
        ));
        
        return cacheManager;
    }
} 
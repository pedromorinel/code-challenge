package com.code.challenge.omdb.integration.bffomdb.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RateLimitingConfig {
    
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private static final int REQUESTS_PER_MINUTE = 100;
    
    public boolean allowRequest(String clientIp) {
        Bucket bucket = getBucket(clientIp);
        boolean allowed = bucket.tryConsume(1);
        
        if (!allowed) {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
        } else {
            log.debug("Request allowed for IP: {} (remaining tokens: {})", 
                clientIp, bucket.getAvailableTokens());
        }
        
        return allowed;
    }
    
    public long getSecondsToWait(String clientIp) {
        Bucket bucket = getBucket(clientIp);
        return bucket.estimateAbilityToConsume(1).getNanosToWaitForRefill() / 1_000_000_000;
    }
    
    private Bucket getBucket(String clientIp) {
        return buckets.computeIfAbsent(clientIp, this::createBucket);
    }
    
    private Bucket createBucket(String clientIp) {

        Bandwidth bandwidth = Bandwidth.classic(
            REQUESTS_PER_MINUTE, 
            Refill.intervally(REQUESTS_PER_MINUTE, Duration.ofMinutes(1))
        );
        
        log.debug("Created new rate limiting bucket for IP: {}", clientIp);
        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }
} 
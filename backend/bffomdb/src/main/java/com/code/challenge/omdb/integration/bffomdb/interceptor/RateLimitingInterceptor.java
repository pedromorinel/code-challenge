package com.code.challenge.omdb.integration.bffomdb.interceptor;

import com.code.challenge.omdb.integration.bffomdb.config.RateLimitingConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingInterceptor implements HandlerInterceptor {
    
    private final RateLimitingConfig rateLimitingConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);

        if (isHealthCheckOrActuator(request.getRequestURI())) {
            return true;
        }
        
        if (!rateLimitingConfig.allowRequest(clientIp)) {
            long retryAfter = rateLimitingConfig.getSecondsToWait(clientIp);
            
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", String.valueOf(retryAfter));
            response.setHeader("X-RateLimit-Limit", "100");
            response.setHeader("X-RateLimit-Remaining", "0");
            response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + (retryAfter * 1000)));
            
            Map<String, Object> errorResponse = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", HttpStatus.TOO_MANY_REQUESTS.value(),
                "error", "Too Many Requests",
                "message", "Rate limit exceeded. You have exceeded the maximum number of requests per minute.",
                "retryAfter", retryAfter,
                "path", request.getRequestURI()
            );
            
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return false;
        }
        
        return true;
    }
    
    private String getClientIp(HttpServletRequest request) {

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private boolean isHealthCheckOrActuator(String uri) {
        return uri.startsWith("/actuator") || 
               uri.contains("/health") ||
               uri.contains("/swagger") ||
               uri.contains("/api-docs");
    }
} 
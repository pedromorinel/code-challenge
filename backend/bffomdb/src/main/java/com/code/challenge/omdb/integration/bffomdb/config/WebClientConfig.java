package com.code.challenge.omdb.integration.bffomdb.config;

import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Slf4j
@Configuration
public class WebClientConfig {
    
    @Value("${omdb.api.url}")
    private String omdbApiUrl;

    @Value("${webclient.timeout.read:30s}")
    private Duration readTimeout;

    
    @Bean
    public WebClient omdbWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(readTimeout)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(readTimeout.toSeconds(), TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(readTimeout.toSeconds(), TimeUnit.SECONDS)));
        
        return WebClient.builder()
                .baseUrl(omdbApiUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .codecs(ClientCodecConfigurer::defaultCodecs)
                .filter(logRequest())
                .filter(logResponse())
                .filter(errorHandler())
                .build();
    }
    
    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            if (log.isDebugEnabled()) {
                log.debug("Request: {} {}", clientRequest.method(), clientRequest.url());
                clientRequest.headers().forEach((name, values) -> 
                    values.forEach(value -> log.debug("Request Header: {}={}", name, value)));
            }
            return Mono.just(clientRequest);
        });
    }
    
    private ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            if (log.isDebugEnabled()) {
                log.debug("Response Status: {}", clientResponse.statusCode());
                clientResponse.headers().asHttpHeaders().forEach((name, values) -> 
                    values.forEach(value -> log.debug("Response Header: {}={}", name, value)));
            }
            return Mono.just(clientResponse);
        });
    }
    
    private ExchangeFilterFunction errorHandler() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            if (clientResponse.statusCode().isError()) {
                log.error("Error response: {}", clientResponse.statusCode());
            }
            return Mono.just(clientResponse);
        });
    }
} 
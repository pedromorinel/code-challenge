package com.code.challenge.omdb.integration.bffomdb.exception;

public class OmdbApiException extends RuntimeException {

    public OmdbApiException(String message) {
        super(message);
    }

    public OmdbApiException(String message, Throwable cause) {
        super(message, cause);
    }

}
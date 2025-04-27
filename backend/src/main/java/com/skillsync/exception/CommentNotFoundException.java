package com.foodlearing.exception; //Standard package for custom exceptions

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(String message) {
        super(message);
    }
}
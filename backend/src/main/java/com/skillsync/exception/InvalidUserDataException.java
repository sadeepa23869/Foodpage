package com.skillsync.exception;

import java.io.Serial;

public class InvalidUserDataException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidUserDataException(String message) {
        super(message);
    }
}

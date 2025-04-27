package com.skillsync.exception;

import java.io.Serial;

public class InvalidLearningPlanDataException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidLearningPlanDataException(String message) {
        super(message);
    }
}

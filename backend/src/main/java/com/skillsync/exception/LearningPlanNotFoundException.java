package com.skillsync.exception;

import java.io.Serial;

public class LearningPlanNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public LearningPlanNotFoundException(String name) {
        super("Learning Plan not found with name: " + name);
    }
}

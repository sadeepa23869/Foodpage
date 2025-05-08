package com.foodlearning.entity;

import lombok.Data;

@Data
public class Topic {
    private String name;
    private boolean completed;
    private String notes;
}
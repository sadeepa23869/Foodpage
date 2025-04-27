package com.skillsync.dto;

import lombok.Data;

import java.util.List;

@Data
public class LearningPlanDTO {
    private String name;
    private String description;
    private List<String> topics;
    private List<String> resources;
}

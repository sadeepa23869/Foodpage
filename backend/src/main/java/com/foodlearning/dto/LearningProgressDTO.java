package com.foodlearning.dto;

import com.foodlearning.entity.Topic;
import com.foodlearning.entity.Resource;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LearningProgressDTO {
    private String id;
    private String userId;
    private String name;
    private String description;
    private List<Topic> topics;
    private List<Resource> resources;
    private int progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

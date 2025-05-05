package com.skillsync.dto;

import com.skillsync.entity.Topic;
import com.skillsync.entity.Resource;
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

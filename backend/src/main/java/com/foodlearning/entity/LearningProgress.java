package com.skillsync.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "learning_progress")
public class LearningProgress {
    @Id
    private String id;
    private String userId;
    private String name;
    private String description;
    private List<Topic> topics = new ArrayList<>();
    private List<Resource> resources = new ArrayList<>();
    private int progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void calculateProgress() {
        if (topics.isEmpty()) {
            this.progress = 0;
            return;
        }

        long completedTopics = topics.stream().filter(Topic::isCompleted).count();
        this.progress = (int) ((completedTopics * 100) / topics.size());
    }
}
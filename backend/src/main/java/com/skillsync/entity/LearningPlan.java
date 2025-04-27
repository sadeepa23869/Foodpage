package com.skillsync.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "learningplans")
public class LearningPlan {

    @Id
    private String id;

    private String name;
    private String description;
    private List<String> topics;
    private List<String> resources;
    private String userId;

    @Override
    public String toString() {
        return "LearningPlan{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", topics=" + topics +
                ", resources=" + resources +
                ", userId='" + userId + '\'' +
                '}';
    }
}

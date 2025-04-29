package com.foodlearning.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String content;
    private List<String> imageIds = new ArrayList<>();
    private String videoId;
    private int likesCount = 0;
    private List<String> likedBy = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    @CreatedDate
    private LocalDateTime createdAt;

    @Data
    public static class Comment {
        private String userId;
        private String content;
        private LocalDateTime createdAt;
    }
}
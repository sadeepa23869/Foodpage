package com.foodlearning.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id  //Marks the is as the primary key
    private String id;
    private String userId; // recipient user ID
    private String senderId; // user who triggered the notification
    private String type; // like, comment
    private String message;  //Contains the content or description of the notification
    private String relatedEntityId; // ID of post/comment
    private boolean isRead;  
    private LocalDateTime createdAt;
} 
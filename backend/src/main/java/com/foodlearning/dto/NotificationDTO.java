package com.foodlearning.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private String id; 
    private String userId;
    private String senderName;
    private String senderPhoto;
    private String type;
    private String message;
    private String relatedEntityId;
    private boolean read;  // Changed from isRead to read
    private LocalDateTime createdAt;
} 
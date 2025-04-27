package com.skillsync.dto;  //Standard package for DTO class

import lombok.Data;
import java.time.LocalDateTime;

@Data  ////from Lombok (generates getters, setters, toString, etc.)
public class CommentDTO {
    private String id;  // Unique identifier for the comment
    private String postId;  // ID of the post this comment belongs to
    private String userId;  // ID of the user who created the comment
    private String username;  //Display name of the comment author
    private String userPhoto; //URL or reference to the author's profile photo
    private String content;  //The actual text content of the comment
    private LocalDateTime createdAt;  // Timestamp of when the comment was created
}
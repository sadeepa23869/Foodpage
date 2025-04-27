package com.skillsync.dto;

import com.skillsync.entity.Post;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private String id;
    private String userId;
    private String content;
    private List<String> imageUrls;
    private String videoUrl;
    private int likesCount;
    private List<String> likedBy;
    private List<Post.Comment> comments;
    private LocalDateTime createdAt;
}
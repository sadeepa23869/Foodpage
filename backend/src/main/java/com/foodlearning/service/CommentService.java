package com.foodlearning.service;  //Standard package for service classes

import com.foodlearning.dto.CommentDTO;
import com.foodlearning.entity.Comment;
import com.foodlearning.exception.CommentNotFoundException;
import com.foodlearning.repo.CommentRepository;
import com.foodlearning.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service  //Marks this as a Spring service component
public class CommentService {

    @Autowired
    private CommentRepository commentRepository; // For database operations on comments

    @Autowired
    private UserRepository userRepository;  //To fetch user details when converting to DTOs

    public Comment createComment(String postId, String userId, String content) {
        Comment comment = new Comment();
        comment.setPostId(postId);  //The post being commented on
        comment.setUserId(userId);  // Author of the comment
        comment.setContent(content);  // Comment text
        comment.setCreatedAt(LocalDateTime.now()); //Sets current timestamp
        return commentRepository.save(comment);  //Saves to database
    }

    public Comment getCommentById(String id) {  //Retrieves a single comment
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + id));
    }

    public List<Comment> getCommentsByPostId(String postId) {  //Gets all comments for a post
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public Comment updateComment(String id, String userId, String content) {  //Updates comment content
        Comment comment = getCommentById(id);
        if (!comment.getUserId().equals(userId)) {  //Verifies requesting user owns the comment
            throw new RuntimeException("Not authorized to update this comment");
        }
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(String id, String userId) {  //Deletes a comment
        Comment comment = getCommentById(id);
        if (!comment.getUserId().equals(userId)) {  ///Verifies requesting user owns the comment
            throw new RuntimeException("Not authorized to delete this comment");
        }
        commentRepository.deleteById(id);
    }

    public CommentDTO convertToDTO(Comment comment) {  //Converts Comment entity to CommentDTO
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        
        // Fetch user details
        userRepository.findById(comment.getUserId()).ifPresent(user -> {
            dto.setUsername(user.getName());
            dto.setUserPhoto(user.getPhoto());
        });
        
        return dto;
    }
}
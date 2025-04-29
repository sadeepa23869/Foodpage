package com.foodlearning.repo;   //Standard package for repository interfaces

import com.foodlearning.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);  //Finds all comments for a specific post
    List<Comment> findByUserId(String userId);  //Finds all comments made by a specific user
}
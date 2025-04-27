package com.skillsync.repo;

import com.skillsync.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Post> findAllByOrderByCreatedAtDesc();
}
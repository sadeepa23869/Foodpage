package com.foodlearning.service;

import com.foodlearning.dto.PostDTO;
import com.foodlearning.entity.Post;
import com.foodlearning.exception.PostNotFoundException;
import com.foodlearning.repo.PostRepository;
import com.foodlearning.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Post createPost(String userId, String content, List<MultipartFile> images, MultipartFile video)
            throws IOException {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());

        if (images != null && !images.isEmpty()) {
            if (images.size() > 3) {
                throw new RuntimeException("Maximum 3 images allowed");
            }
            post.setImageIds(fileStorageService.storeMultipleFiles(images, userId));
        }

        if (video != null && !video.isEmpty()) {
            if (images != null && !images.isEmpty()) {
                throw new RuntimeException("Cannot upload both images and video");
            }
            post.setVideoId(fileStorageService.storeFile(video, userId));
        }

        return postRepository.save(post);
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Post updatePost(String id, String content) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setContent(content);
                    return postRepository.save(post);
                })
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));
    }

    public void deletePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + id));

        // Delete associated files
        if (post.getImageIds() != null) {
            post.getImageIds().forEach(fileStorageService::deleteFile);
        }
        if (post.getVideoId() != null) {
            fileStorageService.deleteFile(post.getVideoId());
        }

        postRepository.deleteById(id);
    }

    /*
     * public Post likePost(String postId, String userId) {
     * Post post = postRepository.findById(postId)
     * .orElseThrow(() -> new PostNotFoundException("Post not found with id: " +
     * postId));
     * 
     * if (!post.getLikedBy().contains(userId)) {
     * post.getLikedBy().add(userId);
     * post.setLikesCount(post.getLikesCount() + 1);
     * return postRepository.save(post);
     * }
     * return post;
     * }
     */

    @Autowired
    private NotificationService notificationService;

    public Post likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (!post.getLikedBy().contains(userId)) {
            post.getLikedBy().add(userId);
            post.setLikesCount(post.getLikesCount() + 1);

            // Send notification to post owner
            if (!post.getUserId().equals(userId)) { // Don't notify yourself
                notificationService.createNotification(
                        post.getUserId(),
                        userId,
                        "like",
                        "liked your post",
                        postId);
            }

            return postRepository.save(post);
        }
        return post;
    }

    public Post unlikePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (post.getLikedBy().contains(userId)) {
            post.getLikedBy().remove(userId);
            post.setLikesCount(post.getLikesCount() - 1);
            return postRepository.save(post);
        }
        return post;
    }

    public PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setContent(post.getContent());
        dto.setLikesCount(post.getLikesCount());
        dto.setLikedBy(post.getLikedBy());
        dto.setComments(post.getComments());
        dto.setCreatedAt(post.getCreatedAt());

        // Generate URLs for images and video
        if (post.getImageIds() != null && !post.getImageIds().isEmpty()) {
            dto.setImageUrls(post.getImageIds().stream()
                    .map(id -> "/api/posts/media/" + id)
                    .collect(Collectors.toList()));
        }

        if (post.getVideoId() != null) {
            dto.setVideoUrl("/api/posts/media/" + post.getVideoId());
        }

        return dto;
    }
}
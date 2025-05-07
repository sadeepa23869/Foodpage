package com.foodlearning.controller;

import com.foodlearning.dto.LearningProgressDTO;
import com.foodlearning.entity.LearningProgress;
import com.foodlearning.security.JwtService;
import com.foodlearning.service.LearningProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-progress")
public class LearningProgressController {

    private final LearningProgressService learningProgressService;
    private final JwtService jwtService;

    @Autowired
    public LearningProgressController(LearningProgressService learningProgressService, JwtService jwtService) {
        this.learningProgressService = learningProgressService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<LearningProgress> createLearningProgress(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody LearningProgressDTO learningProgressDTO) {
        String userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        learningProgressDTO.setUserId(userId);
        LearningProgress created = learningProgressService.createLearningProgress(learningProgressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<LearningProgress>> getAllLearningProgressByUser(
            @RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<LearningProgress> progressList = learningProgressService.getAllLearningProgressByUser(userId);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningProgress> getLearningProgressById(@PathVariable String id) {
        return learningProgressService.getLearningProgressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgress> updateLearningProgress(
            @PathVariable String id,
            @RequestBody LearningProgressDTO learningProgressDTO) {
        LearningProgress updated = learningProgressService.updateLearningProgress(id, learningProgressDTO);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/topics/{topicName}")
    public ResponseEntity<LearningProgress> updateTopicStatus(
            @PathVariable String id,
            @PathVariable String topicName,
            @RequestParam boolean completed) {
        LearningProgress updated = learningProgressService.updateTopicStatus(id, topicName, completed);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningProgress(@PathVariable String id) {
        learningProgressService.deleteLearningProgress(id);
        return ResponseEntity.noContent().build();
    }

    private String getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }
}
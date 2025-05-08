package com.foodlearning.service;

import com.foodlearning.dto.LearningProgressDTO;
import com.foodlearning.entity.LearningProgress;
import com.foodlearning.entity.Topic;
import com.foodlearning.repo.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressService {

    private final LearningProgressRepository learningProgressRepository;

    @Autowired
    public LearningProgressService(LearningProgressRepository learningProgressRepository) {
        this.learningProgressRepository = learningProgressRepository;
    }

    public LearningProgress createLearningProgress(LearningProgressDTO learningProgressDTO) {
        LearningProgress learningProgress = new LearningProgress();
        learningProgress.setUserId(learningProgressDTO.getUserId());
        learningProgress.setName(learningProgressDTO.getName());
        learningProgress.setDescription(learningProgressDTO.getDescription());
        learningProgress.setTopics(learningProgressDTO.getTopics());
        learningProgress.setResources(learningProgressDTO.getResources());
        learningProgress.setCreatedAt(LocalDateTime.now());
        learningProgress.setUpdatedAt(LocalDateTime.now());
        learningProgress.calculateProgress();
        return learningProgressRepository.save(learningProgress);
    }

    public List<LearningProgress> getAllLearningProgressByUser(String userId) {
        return learningProgressRepository.findByUserId(userId);
    }

    public Optional<LearningProgress> getLearningProgressById(String id) {
        return learningProgressRepository.findById(id);
    }

    public LearningProgress updateLearningProgress(String id, LearningProgressDTO learningProgressDTO) {
        return learningProgressRepository.findById(id)
                .map(existingProgress -> {
                    if (learningProgressDTO.getName() != null) {
                        existingProgress.setName(learningProgressDTO.getName());
                    }
                    if (learningProgressDTO.getDescription() != null) {
                        existingProgress.setDescription(learningProgressDTO.getDescription());
                    }
                    if (learningProgressDTO.getTopics() != null) {
                        existingProgress.setTopics(learningProgressDTO.getTopics());
                    }
                    if (learningProgressDTO.getResources() != null) {
                        existingProgress.setResources(learningProgressDTO.getResources());
                    }
                    existingProgress.calculateProgress();
                    existingProgress.setUpdatedAt(LocalDateTime.now());
                    return learningProgressRepository.save(existingProgress);
                })
                .orElseThrow(() -> new RuntimeException("LearningProgress not found with id: " + id));
    }

    public void deleteLearningProgress(String id) {
        learningProgressRepository.deleteById(id);
    }

    public LearningProgress updateTopicStatus(String learningProgressId, String topicName, boolean completed) {
        LearningProgress learningProgress = learningProgressRepository.findById(learningProgressId)
                .orElseThrow(() -> new RuntimeException("LearningProgress not found"));

        learningProgress.getTopics().stream()
                .filter(topic -> topic.getName().equals(topicName))
                .findFirst()
                .ifPresent(topic -> {
                    topic.setCompleted(completed);
                    learningProgress.calculateProgress();
                    learningProgress.setUpdatedAt(LocalDateTime.now());
                    learningProgressRepository.save(learningProgress);
                });

        return learningProgress;
    }
}

package com.skillsync.repo;

import com.skillsync.entity.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {

    Optional<LearningPlan> findByName(String name);

    List<LearningPlan> findByUserId(String userId);

}

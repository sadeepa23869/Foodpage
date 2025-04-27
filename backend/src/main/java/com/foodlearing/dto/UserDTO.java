package com.foodlearing.dto;

import lombok.Data;

import java.util.List;

import com.foodlearing.entity.FollowInfo;
import com.foodlearing.entity.LearningPlan;

@Data
public class UserDTO {
    private String id;
    private String email;
    private String name;
    private String password;
    private List<FollowInfo> followers;
    private List<FollowInfo> following;
    private List<LearningPlan> learningPlans;
}

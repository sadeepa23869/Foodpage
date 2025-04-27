package com.skillsync.dto;

import com.skillsync.entity.FollowInfo;
import com.skillsync.entity.LearningPlan;
import lombok.Data;

import java.util.List;

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

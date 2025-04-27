package com.skillsync.service;

import com.skillsync.entity.User;
import com.skillsync.repo.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CREATE
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // READ ALL
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // READ BY ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // READ BY EMAIL
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // UPDATE
    public User updateUser(String id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(updatedUser.getEmail());
                    user.setName(updatedUser.getName());
                    user.setPassword(updatedUser.getPassword());
                    user.setFollowers(updatedUser.getFollowers());
                    user.setFollowing(updatedUser.getFollowing());
                    user.setLearningPlanIds(updatedUser.getLearningPlanIds());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // UPDATE PROFILE BY EMAIL
    public Optional<User> updateUserProfileByEmail(String email, User updatedProfile) {
        return userRepository.findByEmail(email).map(user -> {
            if (updatedProfile.getName() != null) user.setName(updatedProfile.getName());
            if (updatedProfile.getBio() != null) user.setBio(updatedProfile.getBio());
            if (updatedProfile.getPhoto() != null) user.setPhoto(updatedProfile.getPhoto());
            // Add more fields as needed, but do NOT update email or password here
            return userRepository.save(user);
        });
    }

    // DELETE
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // DELETE BY EMAIL
    public boolean deleteUserByEmail(String email) {
        logger.info("Attempting to delete user with email: {}", email);
        return userRepository.findByEmail(email)
                .map(user -> {
                    logger.info("User found: {} (id: {})", user.getEmail(), user.getId());
                    userRepository.deleteById(user.getId());
                    logger.info("User deleted: {}", user.getId());
                    return true;
                })
                .orElseGet(() -> {
                    logger.warn("No user found with email: {}", email);
                    return false;
                });
    }
}
